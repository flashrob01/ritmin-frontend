import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { WalletConnectService } from "./walletconnect.service";
import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { rpc, sc, wallet } from "@cityofzion/neon-js";
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
    .pipe(map(resp => resp.stack[0]?.value as string));
  }

  public filterWCA(req: AdvanceQueryReqBody): Observable<WCA[]> {
    const params = [
      sc.ContractParam.hash160(req.creator ?? WcaService.HASH160_ZERO),
      sc.ContractParam.hash160(req.buyer ?? WcaService.HASH160_ZERO),
      sc.ContractParam.integer(req.page),
      sc.ContractParam.integer(req.size)
    ];
    return this.rpcRequest("advanceQuery", params).pipe(
      map(res => JSON.parse(atob(res))),
      map(res => res.map(v => this.mapToWCA(v))));
  }

  /* public queryWCA(identifier: string): Observable<WCA> {
    const params = [
      sc.ContractParam.string(identifier)
    ];
    return this.rpcRequest("queryWCA", params).pipe(map(resp => this.mapToWCA(resp)));
  } */

  public queryPurchase(identifier: string, buyer: string): Observable<number> {
    const params = [
      sc.ContractParam.string(identifier),
      sc.ContractParam.hash160(buyer)
    ];
    return this.rpcRequest("queryPurchase", params);
  }

  public createWCA(info: CreateWcaRequestBody): Observable<string> {
    const owner = {type: 'Address', value: info.hash};
    const stakePer100Token = {type: 'Integer', value: info.stakePer100Token};
    const maxTokenSoldCount = {type: 'Integer', value: info.maxTokenSoldCount};
    const descriptions = {type: 'Array', value: info.descriptions};
    const endTimestamps = {type: 'Array', value: info.endTimestamps};
    const thresholdIndex = {type: 'Integer', value: info.thresholdIndex};
    const coolDownInterval = {type: 'Integer', value: info.coolDownInterval};
    const identifier = {type: 'String', value: info.identifier};
    const parameters = [owner, stakePer100Token, maxTokenSoldCount, descriptions, endTimestamps, thresholdIndex, coolDownInterval, identifier];
    return this.walletConnectService.invokeFunction(environment.wcaContractHash, "createWCA", parameters).pipe(map(r => r.result));
  }

  public finishMilestone(identifier: string, index: number, proofOfWork: string): void {
  }

  public finishWCA(identifier: string): void {
  }

  public refund(identifier: string, buyer: string): void {
  }

  private mapToWCA(resp: any): WCA {
    return {
      identifier: resp[0],
      description: resp[1],
      creator: wallet.getAddressFromScriptHash(WcaService.processBase64Hash160(resp[2])),
      creationTimestamp: resp[3] == -1 ? null : new Date(resp[3]),
      stakePer100Token: resp[4],
      maxTokenSoldCount: resp[5],
      milestonesCount: resp[6],
      milestones: this.parseMilestones(resp[7]),
      thresholdMilestoneIndex: resp[8],
      coolDownInterval: resp[9],
      lastUpdateTimestamp: resp[10] == -1 ? null : new Date(resp[10]),
      nextMilestone: resp[11],
      remainTokenCount: resp[12],
      buyerCount: resp[13],
      status: resp[14]
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

