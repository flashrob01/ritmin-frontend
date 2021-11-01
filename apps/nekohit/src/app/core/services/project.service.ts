import { Injectable } from '@angular/core';
import { environment } from 'apps/nekohit/src/environments/environment';
import { from, Observable } from 'rxjs';
import { Milestone, NekoHitProject } from '../../shared/models/project.model';
import { NeolineService } from './neoline.service';
import { rpc, sc } from '@cityofzion/neon-js';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class NekohitProjectService {
  constructor(private neoline: NeolineService) {}

  public static HASH160_ZERO = '0000000000000000000000000000000000000000';

  public getProjects(): Observable<NekoHitProject[]> {
    const params = [
      sc.ContractParam.hash160(NekohitProjectService.HASH160_ZERO),
      sc.ContractParam.hash160(NekohitProjectService.HASH160_ZERO),
      sc.ContractParam.integer('1'),
      sc.ContractParam.integer('90'),
    ];
    return this.rpcRequest('advanceQuery', params).pipe(
      map((res) => JSON.parse(atob(res))),
      map((res) => res.map((v: any) => this.mapToProject(v)))
    );
  }

  private rpcRequest(method: string, params: any[]): Observable<any> {
    const rpcClient = new rpc.RPCClient(environment.testNetNodeUrl);
    return from(
      rpcClient.invokeFunction(
        environment.testNetWcaContractHash,
        method,
        params
      )
    ).pipe(
      tap((v) => console.log('rpc', v)),
      map((resp) => resp.stack[0]?.value as string)
    );
  }

  private mapToProject(resp: any): NekoHitProject {
    return {
      identifier: resp[0],
      description: resp[1],
      creator: '',
      //creator: wallet.getAddressFromScriptHash(WcaService.processBase64Hash160(resp[2])),
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
