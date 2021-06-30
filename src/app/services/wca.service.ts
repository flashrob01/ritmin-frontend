import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { WalletConnectService } from "./walletconnect.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export interface CreateWcaRequest {
  hash: string;
  stakePer100Token: number;
  maxTokenSoldCount: number,
  descriptions: string[],
  endTimestamps: number[],
  thresholdIndex: number,
  coolDownInterval: number,
  identifier: string
}

export interface QueryRequest {
  creator?: string,
  buyer?: string;
  unpaid?: boolean,
  canPurchase?: boolean,
  onGoing?: boolean;
  finished?: boolean;
  page?: number,
  size?: number
}

@Injectable({
  providedIn: 'root'
})
export class WcaService {

  constructor(private readonly walletConnectService: WalletConnectService) {}

  public queryWca(identifier: string): Observable<string> {
    return this.walletConnectService.invokeFunction(environment.wcaContractHash, "queryWca", [identifier]).pipe(
      map(result => result.result));
  }

  public queryPurchase(identifier: string): string {
    return null;
  }

  public createWca(info: CreateWcaRequest): string {
    return null;
  }

  public finishMilestone(identifier: string, index: number, proofOfWork: string): void {
  }

  public finishWCA(identifier: string): void {
  }

  public refund(identifier: string, buyer: string): void {
  }

  public advanceQuery(req?: QueryRequest): Observable<string> {
    return this.walletConnectService.invokeFunction(environment.wcaContractHash, "advanceQuery", [req]).pipe(
      map(result => result.result));
  }

}
