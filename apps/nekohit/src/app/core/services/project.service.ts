import { Inject, Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Milestone, NekoHitProject } from '../../shared/models/project.model';
import { NeolineService } from './neoline.service';
import { sc, wallet } from '@cityofzion/neon-js';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { HASH160_ZERO, processBase64Hash160 } from './utils';
import { NeonJSService } from './neonjs.service';
import { NeoInvokeWriteResponse } from '../models/n3';
import { GlobalState, GLOBAL_RX_STATE } from '../../global.state';
import { RxState } from '@rx-angular/state';
import { ErrorService } from './error.service';
import { environment } from '../../../../src/environments/environment';
import { GAS_SYMBOL, TokenService } from './token.service';
import { CREATE_GAS_FEE, STAKE_GAS_FEE } from '../../../../src/config';
import multiavatar from '@multiavatar/multiavatar';

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
    private tokenService: TokenService,
    @Inject(GLOBAL_RX_STATE) private globalState: RxState<GlobalState>
  ) {}

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

  public getStakingInfos(identifier: string): Observable<number> {
    const address = this.globalState.get('address');
    if (!address) {
      return of(0);
    }
    const params = [
      sc.ContractParam.string(identifier),
      sc.ContractParam.hash160(address),
    ];

    const scriptHash = this.globalState.get('mainnet')
      ? environment.mainnet.wcaContractHash
      : environment.testnet.wcaContractHash;
    return this.neonJS.rpcRequest('queryPurchase', params, scriptHash).pipe(
      catchError((err) => {
        this.errorService.handleError(err);
        return throwError(of([]));
      })
    );
  }

  public stakeTokens(
    amount: number,
    identifier: string,
    tokenHash: string
  ): Observable<NeoInvokeWriteResponse> {
    const wcaHash = this.globalState.get('mainnet')
      ? environment.mainnet.wcaContractHash
      : environment.testnet.wcaContractHash;
    const devAddress = this.globalState.get('mainnet')
      ? environment.mainnet.devFeeAddress
      : environment.testnet.devFeeAddress;
    const from = this.globalState.get('address');
    const stakeTokens = {
      scriptHash: tokenHash,
      operation: 'transfer',
      args: [
        NeolineService.address(from),
        NeolineService.hash160(wcaHash),
        NeolineService.int(amount),
        NeolineService.string(identifier),
      ],
    };
    const payFee = {
      scriptHash: this.tokenService.getTokenBySymbol(GAS_SYMBOL).hash,
      operation: 'transfer',
      args: [
        NeolineService.address(from),
        NeolineService.address(devAddress),
        NeolineService.int(STAKE_GAS_FEE),
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
    const wcaHash = this.globalState.get('mainnet')
      ? environment.mainnet.wcaContractHash
      : environment.testnet.wcaContractHash;
    const gas = this.tokenService.getTokenBySymbol(GAS_SYMBOL);
    const devAddress = this.globalState.get('mainnet')
      ? environment.mainnet.devFeeAddress
      : environment.testnet.devFeeAddress;

    const createProject = {
      scriptHash: wcaHash,
      operation: 'declareProject',
      args: parameters,
    };
    const payFee = {
      scriptHash: gas.hash,
      operation: 'transfer',
      args: [
        NeolineService.address(args.creator),
        NeolineService.address(devAddress),
        NeolineService.int(CREATE_GAS_FEE),
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

  public getProject(identifier: string): Observable<NekoHitProject> {
    const params = [sc.ContractParam.string(identifier)];
    const scriptHash = this.globalState.get('mainnet')
      ? environment.mainnet.wcaContractHash
      : environment.testnet.wcaContractHash;
    return this.neonJS.rpcRequest('queryProject', params, scriptHash).pipe(
      catchError((err) => {
        this.errorService.handleError(err);
        return throwError(of([]));
      }),
      map((res) => JSON.parse(atob(res))),
      map((res) => this.mapToProject(res))
    );
  }

  public finishMilestone(
    identifier: string,
    index: number,
    proofOfWork: string
  ): Observable<NeoInvokeWriteResponse> {
    const wca = this.globalState.get('mainnet')
      ? environment.mainnet.wcaContractHash
      : environment.testnet.wcaContractHash;

    return this.neoline
      .addressToScriptHash(this.globalState.get('address'))
      .pipe(
        map((result) => result.scriptHash),
        switchMap((address) => {
          return this.neoline.invoke(
            wca,
            'finishMilestone',
            [
              NeolineService.string(identifier),
              NeolineService.int(index),
              NeolineService.string(proofOfWork),
            ],
            [{ account: address, scopes: 1 }]
          );
        }),
        catchError((err) => {
          return this.errorService.handleError(err);
        })
      );
  }

  public refund(identifier: string): Observable<NeoInvokeWriteResponse> {
    const wca = this.globalState.get('mainnet')
      ? environment.mainnet.wcaContractHash
      : environment.testnet.wcaContractHash;

    return this.neoline
      .addressToScriptHash(this.globalState.get('address'))
      .pipe(
        map((result) => result.scriptHash),
        switchMap((address) => {
          return this.neoline.invoke(
            wca,
            'refund',
            [
              NeolineService.string(identifier),
              NeolineService.address(address),
            ],
            [{ account: address, scopes: 1 }]
          );
        }),
        catchError((err) => {
          return this.errorService.handleError(err);
        })
      );
  }

  public finishProject(identifier: string): Observable<NeoInvokeWriteResponse> {
    const wca = this.globalState.get('mainnet')
      ? environment.mainnet.wcaContractHash
      : environment.testnet.wcaContractHash;

    return this.neoline
      .addressToScriptHash(this.globalState.get('address'))
      .pipe(
        map((result) => result.scriptHash),
        switchMap((address) => {
          return this.neoline.invoke(
            wca,
            'finishProject',
            [NeolineService.string(identifier)],
            [{ account: address, scopes: 1 }]
          );
        }),
        catchError((err) => {
          return this.errorService.handleError(err);
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
      maxTokenSoldCount: resp[6],
      milestonesCount: resp[7],
      milestones: this.parseMilestones(resp[8]),
      thresholdMilestoneIndex: resp[9],
      coolDownInterval: resp[10],
      lastUpdateTimestamp: resp[11] === -1 ? new Date(-1) : new Date(resp[11]),
      nextMilestone: resp[12],
      remainTokenCount: resp[13],
      buyerCount: resp[14],
      status: resp[15],
      stage: resp[16],
      isPublic: true,
      tokenSymbol: this.tokenService.getTokenByHash(
        processBase64Hash160(resp[3])
      ).symbol,
      svg: multiavatar(
        wallet.getAddressFromScriptHash(processBase64Hash160(resp[2]))
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
}
