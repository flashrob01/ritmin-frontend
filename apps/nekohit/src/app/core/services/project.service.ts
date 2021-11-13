import { Inject, Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Milestone, NekoHitProject } from '../../shared/models/project.model';
import { NeolineService } from './neoline.service';
import { sc, wallet } from '@cityofzion/neon-js';
import { catchError, map, switchMap } from 'rxjs/operators';
import { HASH160_ZERO, processBase64Hash160 } from './utils';
import { NeonJSService } from './neonjs.service';
import { NeoInvokeWriteResponse } from '../models/n3';
import { GlobalState, GLOBAL_RX_STATE } from '../../global.state';
import { RxState } from '@rx-angular/state';
import { environment } from 'apps/nekohit/src/environments/environment';
import { ErrorService } from './error.service';

export interface CreateProjectArgs {
  creator: string;
  token: string;
  stakePer100Token: number;
  fundingGoal: number;
  projectDescription: string;
  projectTitle: string;
  milestoneDescriptions: string[];
  milestoneTitles: string[];
  milestoneDeadlines: number[];
  thresholdIndex: number;
  cooldownInMs: number;
  isPublic: boolean;
}

export interface GetProjectsArgs {
  token?: string;
  creator?: string;
  supporter?: string;
  page?: number;
  size?: number;
}

@Injectable()
export class NekohitProjectService {
  constructor(
    private neoline: NeolineService,
    private neonJS: NeonJSService,
    private errorService: ErrorService,
    @Inject(GLOBAL_RX_STATE) private globalState: RxState<GlobalState>
  ) {}

  // 0.01 GAS
  stakefee = 1_000_000;
  // 0.02 GAS
  createFee = 2_000_000;

  public getProjects(args?: GetProjectsArgs): Observable<NekoHitProject[]> {
    const params = [
      sc.ContractParam.hash160(args?.token != null ? args.token : HASH160_ZERO),
      sc.ContractParam.hash160(
        args?.creator != null ? args.creator : HASH160_ZERO
      ),
      sc.ContractParam.hash160(
        args?.supporter != null ? args.supporter : HASH160_ZERO
      ),
      sc.ContractParam.integer(args?.page != null ? args.page : 1),
      sc.ContractParam.integer(args?.size != null ? args.size : 100),
    ];
    const scriptHash = this.globalState.get('mainnet')
      ? environment.mainnet.wcaContractHash
      : environment.testnet.wcaContractHash;
    return this.neonJS.rpcRequest('advanceQuery', params, scriptHash).pipe(
      catchError((err) => {
        this.errorService.handleError(err);
        return throwError(of([]));
      }),
      map((res) => JSON.parse(atob(res))),
      map((res) => res.map((v: any) => this.mapToProject(v)))
    );
  }

  public stakeTokens(
    from: string,
    amount: number,
    identifier: string
  ): Observable<NeoInvokeWriteResponse> {
    const catContractHash = this.globalState.get('mainnet')
      ? environment.mainnet.catTokenHash
      : environment.testnet.catTokenHash;
    const wcaContractHash = this.globalState.get('mainnet')
      ? environment.mainnet.wcaContractHash
      : environment.testnet.wcaContractHash;
    const gasContractHash = this.globalState.get('mainnet')
      ? environment.mainnet.gasContractHash
      : environment.testnet.gasContractHash;
    const devAddress = this.globalState.get('mainnet')
      ? environment.mainnet.devAddress
      : environment.testnet.devAddress;
    const stakeTokens = {
      scriptHash: catContractHash,
      operation: 'transfer',
      args: [
        NeolineService.address(from),
        NeolineService.hash160(wcaContractHash),
        NeolineService.int(amount),
        NeolineService.string(identifier),
      ],
    };
    const payFee = {
      scriptHash: gasContractHash,
      operation: 'transfer',
      args: [
        NeolineService.address(from),
        NeolineService.address(devAddress),
        NeolineService.int(this.stakefee),
        NeolineService.any(null),
      ],
    };

    return this.neoline
      .addressToScriptHash(this.globalState.get('address'))
      .pipe(
        map((result) => result.scriptHash),
        switchMap((address) => {
          return this.neoline
            .invokeReadMulti({
              invokeReadArgs: [stakeTokens, payFee],
              signers: [{ account: address, scopes: 1 }],
            })
            .pipe(
              catchError((err) => {
                return this.errorService.handleError(err);
              }),
              switchMap(() => {
                return this.neoline.invokeMultiple({
                  signers: [{ account: address, scopes: 1 }],
                  invokeArgs: [stakeTokens, payFee],
                });
              })
            );
        })
      );
  }

  public createProject(
    args: CreateProjectArgs
  ): Observable<NeoInvokeWriteResponse> {
    const parameters = [
      NeolineService.address(args.creator),
      NeolineService.string(args.projectDescription),
      NeolineService.hash160(args.token),
      NeolineService.int(args.stakePer100Token),
      NeolineService.int(args.fundingGoal),
      NeolineService.array(
        args.milestoneTitles.map((title) => NeolineService.string(title))
      ),
      NeolineService.array(
        args.milestoneDescriptions.map((desc) => NeolineService.string(desc))
      ),
      NeolineService.array(
        args.milestoneDeadlines.map((deadline) => NeolineService.int(deadline))
      ),
      NeolineService.int(args.thresholdIndex),
      NeolineService.int(args.cooldownInMs),
      NeolineService.bool(args.isPublic),
      NeolineService.string(args.projectTitle),
    ];
    const wcaContractHash = this.globalState.get('mainnet')
      ? environment.mainnet.wcaContractHash
      : environment.testnet.wcaContractHash;
    const gasContractHash = this.globalState.get('mainnet')
      ? environment.mainnet.gasContractHash
      : environment.testnet.gasContractHash;
    const devAddress = this.globalState.get('mainnet')
      ? environment.mainnet.devAddress
      : environment.testnet.devAddress;

    const createProject = {
      scriptHash: wcaContractHash,
      operation: 'declareProject',
      args: parameters,
    };
    const payFee = {
      scriptHash: gasContractHash,
      operation: 'transfer',
      args: [
        NeolineService.address(args.creator),
        NeolineService.address(devAddress),
        NeolineService.int(this.stakefee),
        NeolineService.any(null),
      ],
    };

    return this.neoline
      .addressToScriptHash(this.globalState.get('address'))
      .pipe(
        map((result) => result.scriptHash),
        switchMap((address) => {
          return this.neoline
            .invokeReadMulti({
              invokeReadArgs: [createProject, payFee],
              signers: [{ account: address, scopes: 1 }],
            })
            .pipe(
              catchError((err) => {
                return this.errorService.handleError(err);
              }),
              switchMap(() => {
                return this.neoline.invokeMultiple({
                  signers: [{ account: address, scopes: 1 }],
                  invokeArgs: [createProject, payFee],
                });
              })
            );
        })
      );
  }

  private mapToProject(resp: any): NekoHitProject {
    return {
      identifier: resp[0],
      description: resp[1],
      creator: wallet.getAddressFromScriptHash(processBase64Hash160(resp[2])),
      token: wallet.getAddressFromScriptHash(processBase64Hash160(resp[3])),
      creationTimestamp: new Date(resp[4]),
      stakePer100Token: resp[5] / 100,
      maxTokenSoldCount: resp[6] / 100,
      milestonesCount: resp[7],
      milestones: this.parseMilestones(resp[8]),
      thresholdMilestoneIndex: resp[9],
      coolDownInterval: resp[10],
      lastUpdateTimestamp: resp[11] === -1 ? new Date(-1) : new Date(resp[11]),
      nextMilestone: resp[12],
      remainTokenCount: resp[13] / 100,
      buyerCount: resp[14],
      status: resp[15],
      stage: resp[16],
      isPublic: true,
      tokenSymbol: this.getTokenSymbolFromTokenHash(
        processBase64Hash160(resp[3])
      ),
    };
  }

  private parseMilestones(milestones: any[]): Milestone[] {
    return milestones.map((ms) => {
      return {
        title: ms[0],
        description: ms[1],
        endTimestamp: new Date(ms[2]),
        linkToResult: ms[3],
      };
    });
  }

  private getTokenSymbolFromTokenHash(hash: string): string {
    const mainnet = this.globalState.get('mainnet');

    const gasToken = mainnet
      ? environment.mainnet.gasContractHash
      : environment.testnet.gasContractHash;
    const catToken = mainnet
      ? environment.mainnet.catTokenHash
      : environment.testnet.catTokenHash;
    if (hash === gasToken.substring(2)) {
      return 'GAS';
    }
    if (hash === catToken.substring(2)) {
      return 'CAT';
    }
    return 'UNKNOWN';
  }
}
