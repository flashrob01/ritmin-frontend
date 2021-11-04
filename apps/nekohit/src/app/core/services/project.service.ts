import { Inject, Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Milestone, NekoHitProject } from '../../shared/models/project.model';
import { NeolineService } from './neoline.service';
import { sc, wallet } from '@cityofzion/neon-js';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { HASH160_ZERO, processBase64Hash160 } from './utils';
import { NeonJSService } from './neonjs.service';
import { NeoInvokeReadResponse, NeoInvokeWriteResponse } from '../models/n3';
import { GlobalState, GLOBAL_RX_STATE } from '../../global.state';
import { RxState } from '@rx-angular/state';
import { environment } from 'apps/nekohit/src/environments/environment';
import { ErrorService } from './error.service';

@Injectable()
export class NekohitProjectService {
  constructor(
    private neoline: NeolineService,
    private neonJS: NeonJSService,
    private errorService: ErrorService,
    @Inject(GLOBAL_RX_STATE) private globalState: RxState<GlobalState>
  ) {}

  public getProjects(
    creator?: string,
    supporter?: string,
    page?: number,
    size?: number
  ): Observable<NekoHitProject[]> {
    const params = [
      sc.ContractParam.hash160(creator != null ? creator : HASH160_ZERO),
      sc.ContractParam.hash160(supporter != null ? supporter : HASH160_ZERO),
      sc.ContractParam.integer(page != null ? page : 1),
      sc.ContractParam.integer(size != null ? size : 100),
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

    return this.neoline
      .addressToScriptHash(this.globalState.get('address'))
      .pipe(
        map((result) => result.scriptHash),
        switchMap((address) => {
          return this.neoline
            .invokeRead(
              catContractHash,
              'transfer',
              [
                NeolineService.address(from),
                NeolineService.hash160(wcaContractHash),
                NeolineService.int(amount),
                NeolineService.string(identifier),
              ],
              [{ account: address, scopes: 1 }]
            )
            .pipe(
              catchError((err) => {
                return this.errorService.handleError(err);
              }),
              switchMap(() => {
                return this.neoline.invoke(
                  catContractHash,
                  'transfer',
                  [
                    NeolineService.address(from),
                    NeolineService.hash160(wcaContractHash),
                    NeolineService.int(amount),
                    NeolineService.string(identifier),
                  ],
                  [{ account: address, scopes: 1 }]
                );
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
      creationTimestamp: new Date(resp[3]),
      stakePer100Token: resp[4] / 100,
      maxTokenSoldCount: resp[5] / 100,
      milestonesCount: resp[6],
      milestones: this.parseMilestones(resp[7]),
      thresholdMilestoneIndex: resp[8],
      coolDownInterval: resp[9],
      lastUpdateTimestamp: resp[10] === -1 ? new Date(-1) : new Date(resp[10]),
      nextMilestone: resp[11],
      remainTokenCount: resp[12] / 100,
      buyerCount: resp[13],
      status: resp[14],
      stage: resp[15],
      isPublic: true,
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
