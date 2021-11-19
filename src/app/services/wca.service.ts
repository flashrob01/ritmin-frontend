import {Injectable} from '@angular/core';
import {from, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {sc, wallet} from '@cityofzion/neon-js';
import {Milestone, Project} from '../models/project-models';
import {NeolineService} from './neoline.service';
import {TypedValue} from '../models/neoline';
import {getCatContractAddress, getRpcNode, getWcaContractAddress} from '../utils';

export interface DeclareProjectRequestBody {
  ownerAddress: string;
  projectDescription: string;
  tokenHash: string;
  stakeRate100: number;
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
  tokenHash: string;
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

  private rpcRequest(contract: string, method: string, params: any[]): Observable<any> {
    return from(getRpcNode().invokeFunction(contract, method, params))
      .pipe(map(resp => resp.stack[0]?.value as string));
  }

  public queryTokenSymbol(hash160: string): Observable<string> {
    return this.rpcRequest(hash160, 'symbol', []).pipe(
      map(res => window.atob(res)));
  }

  public queryTokenFactor(hash160: string): Observable<number> {
    return this.rpcRequest(hash160, 'decimals', []).pipe(
      map(res => Math.pow(10, parseInt(res, 10))));
  }

  private wcaRpcRequest(method: string, params: any[]): Observable<any> {
    return this.rpcRequest(getWcaContractAddress(), method, params);
  }

  public filterProjects(req: AdvanceQueryReqBody): Observable<Project[]> {
    const params = [
      sc.ContractParam.hash160(req.tokenHash ?? WcaService.HASH160_ZERO),
      sc.ContractParam.hash160(req.creator ?? WcaService.HASH160_ZERO),
      sc.ContractParam.hash160(req.buyer ?? WcaService.HASH160_ZERO),
      sc.ContractParam.integer(req.page),
      sc.ContractParam.integer(req.size)
    ];
    return this.wcaRpcRequest('advanceQuery', params).pipe(
      map(res => JSON.parse(atob(res))),
      map(res => res.map(v => this.mapToProject(v))));
  }

  public queryProject(identifier: string): Observable<Project> {
    const params = [
      sc.ContractParam.string(identifier)
    ];
    return this.wcaRpcRequest('queryProject', params)
      .pipe(
        map(res => JSON.parse(atob(res))),
        map(resp => this.mapToProject(resp))
      );
  }

  public queryPurchase(identifier: string, buyer: string): Observable<number> {
    const params = [
      sc.ContractParam.string(identifier),
      sc.ContractParam.hash160(buyer)
    ];
    return this.wcaRpcRequest('queryPurchase', params);
  }

  public declareProject(info: DeclareProjectRequestBody): Observable<InvokeWriteResult> {
    const owner: TypedValue = {type: 'Address', value: info.ownerAddress};
    const stakeRate100: TypedValue = {type: 'Integer', value: info.stakeRate100.toString()};
    const token: TypedValue = {type: 'Hash160', value: info.tokenHash};
    const maxTokenSoldCount: TypedValue = {type: 'Integer', value: info.maxTokenSoldCount.toString()};
    const projectDesc: TypedValue = {type: 'String', value: info.projectDescription};
    const msDescs: TypedValue = {type: 'Array', value: info.msDescriptions.map(ms => ({type: 'String', value: ms}))};
    const msTitles: TypedValue = {type: 'Array', value: info.msTitles.map(ms => ({type: 'String', value: ms}))};
    const endTimestamps: TypedValue = {type: 'Array', value: info.endTimestamps.map(ms => ({type: 'Integer', value: ms}))};
    const thresholdIndex: TypedValue = {type: 'Integer', value: info.thresholdIndex.toString()};
    const coolDownInterval: TypedValue = {type: 'Integer', value: info.coolDownInterval.toString()};
    const identifier: TypedValue = {type: 'String', value: info.identifier};
    const isPublic: TypedValue = {type: 'Boolean', value: info.isPublic};
    const parameters = [
      owner, projectDesc, token, stakeRate100, maxTokenSoldCount, msTitles, msDescs,
      endTimestamps, thresholdIndex, coolDownInterval, isPublic, identifier];

    return from(
      this.neoline.invoke({
        scriptHash: getWcaContractAddress(),
        operation: 'declareProject',
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

  public transferToken(tokenHash160: string, fromAccount: string, amount: number, identifier: string): Observable<InvokeWriteResult> {
    const fromParam: TypedValue = {type: 'Address', value: fromAccount};
    const toParam: TypedValue = {type: 'Hash160', value: getWcaContractAddress()};
    const amountParam: TypedValue = {type: 'Integer', value: amount.toString()};
    const identifierParam: TypedValue = {type: 'String', value: identifier};
    const parameters = [fromParam, toParam, amountParam, identifierParam];
    return from(
      this.neoline.invoke({
        scriptHash: tokenHash160,
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
        scriptHash: getWcaContractAddress(),
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

  public finishProject(identifier: string): Observable<InvokeWriteResult> {
    const identifierParam: TypedValue = {type: 'String', value: identifier};
    const parameters = [identifierParam];

    return from(
      this.neoline.invoke({
        scriptHash: getWcaContractAddress(),
        operation: 'finishProject',
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

  public cancelProject(identifier: string): Observable<InvokeWriteResult> {
    const identifierParam: TypedValue = {type: 'String', value: identifier};
    const parameters = [identifierParam];

    return from(
      this.neoline.invoke({
        scriptHash: getWcaContractAddress(),
        operation: 'cancelProject',
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
        scriptHash: getWcaContractAddress(),
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

  private mapToProject(resp: any): Project {
    const result = {
      identifier: resp[0],
      description: resp[1],
      creator: wallet.getAddressFromScriptHash(WcaService.processBase64Hash160(resp[2])),
      tokenHash: WcaService.processBase64Hash160(resp[3]),
      creationTimestamp: new Date(resp[4]),
      stakeRate100: resp[5] / 100,
      maxTokenSoldCount: resp[6],
      milestonesCount: resp[7],
      milestones: this.parseMilestones(resp[8]),
      thresholdMilestoneIndex: resp[9],
      coolDownInterval: resp[10],
      lastUpdateTimestamp: resp[11] === -1 ? null : new Date(resp[11]),
      nextMilestone: resp[12],
      remainTokenCount: resp[13],
      buyerCount: resp[14],
      status: resp[15],
      stage: resp[16],
    };

    this.queryTokenFactor(result.tokenHash)
      .subscribe((res) => {
        if (res != null) {
          result.maxTokenSoldCount /= res;
          result.remainTokenCount /= res;
        }
      });

    return result;
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
