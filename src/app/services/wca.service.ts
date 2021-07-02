import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { WalletConnectService } from "./walletconnect.service";
import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { rpc, sc } from "@cityofzion/neon-js";
import { WCA } from "../models/wca";
import { Milestone } from "../models/milestone";

export interface CreateWcaRequestBody {
  hash: string;
  stakePer100Token: number;
  maxTokenSoldCount: number,
  descriptions: string[],
  endTimestamps: number[],
  thresholdIndex: number,
  coolDownInterval: number,
  identifier: string
}

export interface AdvanceQueryReqBody {
  creator: string,
  buyer: string,
  unpaid: boolean,
  canPurchase: boolean,
  onGoing: boolean,
  finished: boolean,
  page: number,
  size: number
}

@Injectable({
  providedIn: 'root'
})
export class WcaService {

  private static RPC_CLIENT = new rpc.RPCClient(environment.testNetUrl);
  private static HASH160_ZERO = "0000000000000000000000000000000000000000";

  constructor(private readonly walletConnectService: WalletConnectService) {}

  private rpcRequest(method: string, params: any[]): Observable<any> {
    return from(WcaService.RPC_CLIENT.invokeFunction(environment.wcaContractHash, method, params))
    .pipe(map(resp => JSON.parse(atob(resp.stack?.[0].value as string))));
  }

  public filterWCA(req: AdvanceQueryReqBody): Observable<string[]> {
    const params = [
      sc.ContractParam.hash160(req.creator ?? WcaService.HASH160_ZERO),
      sc.ContractParam.hash160(req.buyer ?? WcaService.HASH160_ZERO),
      sc.ContractParam.boolean(req.unpaid),
      sc.ContractParam.boolean(req.canPurchase),
      sc.ContractParam.boolean(req.onGoing),
      sc.ContractParam.boolean(req.finished),
      sc.ContractParam.integer(req.page),
      sc.ContractParam.integer(req.size)
    ];
    return this.rpcRequest("advanceQuery", params);
  }

  public queryWCA(identifier: string): Observable<WCA> {
    const params = [
      sc.ContractParam.string(identifier)
    ];
    return this.rpcRequest("queryWCA", params).pipe(map(resp => this.mapToWCA(resp)));
  }

  public queryPurchase(identifier: string, buyer: string): Observable<number> {
    const params = [
      sc.ContractParam.string(identifier),
      sc.ContractParam.hash160(buyer)
    ];
    return this.rpcRequest("queryPurchase", params);
  }

  public createWca(info: CreateWcaRequestBody): string {
    return null;
  }

  public finishMilestone(identifier: string, index: number, proofOfWork: string): void {
  }

  public finishWCA(identifier: string): void {
  }

  public refund(identifier: string, buyer: string): void {
  }

  private mapToWCA(resp: any): WCA {
    return {
      creator: WcaService.processBase64Hash160(resp[0]),
      stakePer100Token: resp[1],
      maxTokenSoldCount: resp[2],
      stakePaid: resp[3] == 1,
      milestonesCount: resp[4],
      milestones: this.parseMilestones(resp[5]),
      thresholdMilestoneIndex: resp[6],
      coolDownInterval: resp[7],
      lastUpdateTimestamp: resp[8] == -1 ? null : new Date(resp[8]),
      nextMilestone: resp[9],
      remainTokenCount: resp[10],
      buyerCount: resp[11],
     };
  }

  private parseMilestones(raw: any[]): Milestone[] {
    return raw.map((ms) => {
      return {
        description: ms[0],
        endTimestamp: new Date(ms[1]),
        linkToResult: ms[2],
      };
    })
  }

  private static processBase64Hash160(base64: string): string {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[len - 1 - i] = binary_string.charCodeAt(i);
    }
    return Array.from(bytes).map(x => x.toString(16).padStart(2, '0')).join('');
  }

}

