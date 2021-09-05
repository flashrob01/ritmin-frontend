import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {from, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {rpc, sc, wallet} from '@cityofzion/neon-js';
import {WCA} from '../models/wca';
import {Milestone} from '../models/milestone';
import {NeolineService} from './neoline.service';
import {TypedValue} from '../models/neoline';

export interface CreateWcaRequestBody {
  ownerAddress: string;
  wcaDescription: string;
  stakePer100Token: number;
  maxTokenSoldCount: number;
  msTitles: string[];
  msDescriptions: string[];
  endTimestamps: number[];
  thresholdIndex: number;
  coolDownInterval: number;
  isPublic: boolean;
  identifier: string;
}

export interface AdvanceQueryReqBody {
  creator: string;
  buyer: string;
  page: number;
  size: number;
}

export type InvokeWriteResult = {
  txId: string;
  error: string;
};

@Injectable({
  providedIn: 'root'
})
export class WcaService {

  constructor(
    private readonly neoline: NeolineService
  ) {
  }

  private static RPC_CLIENT = new rpc.RPCClient(environment.testNetUrl);
  private static HASH160_ZERO = '0000000000000000000000000000000000000000';

  private static processBase64Hash160(base64: string): string {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[len - 1 - i] = binaryString.charCodeAt(i);
    }
    return Array.from(bytes).map(x => x.toString(16).padStart(2, '0')).join('');
  }

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
    return this.rpcRequest('advanceQuery', params).pipe(
      map(res => JSON.parse(atob(res))),
      map(res => res.map(v => this.mapToWCA(v))));
  }

  public queryWCA(identifier: string): Observable<WCA> {
    const params = [
      sc.ContractParam.string(identifier)
    ];
    return this.rpcRequest('queryWCA', params)
      .pipe(
        map(res => JSON.parse(atob(res))),
        map(resp => this.mapToWCA(resp))
      );
  }

  public queryPurchase(identifier: string, buyer: string): Observable<number> {
    const params = [
      sc.ContractParam.string(identifier),
      sc.ContractParam.hash160(buyer)
    ];
    return this.rpcRequest('queryPurchase', params);
  }

  public createWCA(info: CreateWcaRequestBody): Observable<InvokeWriteResult> {
    const owner: TypedValue = {type: 'Address', value: info.ownerAddress};
    const stakePer100Token: TypedValue = {type: 'Integer', value: info.stakePer100Token.toString()};
    const maxTokenSoldCount: TypedValue = {type: 'Integer', value: info.maxTokenSoldCount.toString()};
    const wcaDesc: TypedValue = {type: 'String', value: info.wcaDescription};
    const msDescs: TypedValue = {type: 'Array', value: info.msDescriptions.map(ms => ({type: 'String', value: ms}))};
    const msTitles: TypedValue = {type: 'Array', value: info.msTitles.map(ms => ({type: 'String', value: ms}))};
    const endTimestamps: TypedValue = {type: 'Array', value: info.endTimestamps.map(ms => ({type: 'Integer', value: ms}))};
    const thresholdIndex: TypedValue = {type: 'Integer', value: info.thresholdIndex.toString()};
    const coolDownInterval: TypedValue = {type: 'Integer', value: info.coolDownInterval.toString()};
    const identifier: TypedValue = {type: 'String', value: info.identifier};
    const isPublic: TypedValue = {type: 'Boolean', value: info.isPublic};
    const parameters = [
      owner, wcaDesc, stakePer100Token, maxTokenSoldCount, msTitles, msDescs,
      endTimestamps, thresholdIndex, coolDownInterval, isPublic, identifier];

    return from(
      this.neoline.invoke({
        scriptHash: environment.wcaContractHash,
        operation: 'createWCA',
        args: parameters
      })
        .then(r => ({
          txId: r.txid,
          error: null
        }))
        .catch((error) => ({
          txId: null,
          error: this.neoline.handleError(error)
        }))
    );
  }

  public transferCatToken(fromAccount: string, amount: number, identifier: string): Observable<InvokeWriteResult> {
    const fromParam: TypedValue = {type: 'Address', value: fromAccount};
    const toParam: TypedValue = {type: 'Hash160', value: environment.wcaContractHash};
    const amountParam: TypedValue = {type: 'Integer', value: amount.toString()};
    const identifierParam: TypedValue = {type: 'String', value: identifier};
    const parameters = [fromParam, toParam, amountParam, identifierParam];

    return from(
      this.neoline.invoke({
        scriptHash: environment.catTokenHash,
        operation: 'transfer',
        args: parameters
      })
        .then(r => ({
          txId: r.txid,
          error: null
        }))
        .catch((error) => ({
          txId: null,
          error: this.neoline.handleError(error)
        }))
    );
  }

  public finishMilestone(identifier: string, index: number, proofOfWork: string): Observable<InvokeWriteResult> {
    const identifierParam: TypedValue = {type: 'String', value: identifier};
    const indexParam: TypedValue = {type: 'Integer', value: index.toString()};
    const proofOfWorkParam: TypedValue = {type: 'String', value: proofOfWork};
    const parameters = [identifierParam, indexParam, proofOfWorkParam];

    return from(
      this.neoline.invoke({
        scriptHash: environment.wcaContractHash,
        operation: 'finishMilestone',
        args: parameters
      })
        .then(r => {
          console.log(r);
          return {
            txId: r.txid,
            error: null
          };
        })
        .catch((error) => ({
          txId: null,
          error: this.neoline.handleError(error)
        }))
    );
  }

  public finishWCA(identifier: string): Observable<InvokeWriteResult> {
    const identifierParam: TypedValue = {type: 'String', value: identifier};
    const parameters = [identifierParam];

    return from(
      this.neoline.invoke({
        scriptHash: environment.wcaContractHash,
        operation: 'finishWCA',
        args: parameters
      })
        .then(r => ({
          txId: r.txid,
          error: null
        }))
        .catch((error) => ({
          txId: null,
          error: this.neoline.handleError(error)
        }))
    );
  }

  public refund(identifier: string, buyer: string): Observable<InvokeWriteResult> {
    const identifierParam: TypedValue = {type: 'String', value: identifier};
    const buyerParam: TypedValue = {type: 'Address', value: buyer};
    const parameters = [identifierParam, buyerParam];

    return from(
      this.neoline.invoke({
        scriptHash: environment.wcaContractHash,
        operation: 'refund',
        args: parameters
      })
        .then(r => ({
          txId: r.txid,
          error: null
        }))
        .catch((error) => ({
          txId: null,
          error: this.neoline.handleError(error)
        }))
    );
  }

  private mapToWCA(resp: any): WCA {
    return {
      identifier: resp[0],
      description: resp[1],
      creator: wallet.getAddressFromScriptHash(WcaService.processBase64Hash160(resp[2])),
      creationTimestamp: new Date(resp[3]),
      stakePer100Token: resp[4] / 100,
      maxTokenSoldCount: resp[5] / 100,
      milestonesCount: resp[6],
      milestones: this.parseMilestones(resp[7]),
      thresholdMilestoneIndex: resp[8],
      coolDownInterval: resp[9],
      lastUpdateTimestamp: resp[10] === -1 ? null : new Date(resp[10]),
      nextMilestone: resp[11],
      remainTokenCount: resp[12] / 100,
      buyerCount: resp[13],
      status: resp[14],
      stage: resp[15],
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
