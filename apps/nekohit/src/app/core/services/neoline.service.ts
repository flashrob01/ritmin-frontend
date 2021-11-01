import { Injectable } from '@angular/core';
import { from, Observable, ReplaySubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  ACCOUNT_CHANGED,
  CONNECTED,
  N2,
  NeoAccount,
  NeoNetwork,
  NeoPublicKeyData,
  NETWORK_CHANGED,
  READY,
} from '../models/n2';
import {
  N3,
  N3READY,
  NeoBalance,
  NeoGetBalanceResponse,
  NeoInvokeReadResponse,
  NeoSigner,
  NeoTypedValue,
} from '../models/n3';

export interface NeoErrorResponse {
  type: string;
  description: string;
  data: string;
}

@Injectable()
export class NeolineService {
  private readonly N3_READY_EVENT = new ReplaySubject<void>(1);
  private readonly N2_READY_EVENT = new ReplaySubject<void>(1);
  private readonly N3_NEOLINE = new ReplaySubject<N3>(1);
  private readonly N2_NEOLINE = new ReplaySubject<N2>(1);

  constructor() {
    this.registerListeners();
  }

  private registerListeners(): void {
    window.addEventListener(N3READY, () => {
      this.N3_READY_EVENT.next();
    });
    window.addEventListener(READY, () => this.N2_READY_EVENT.next());
    window.addEventListener(CONNECTED, (response) =>
      console.log('CONNECTED', response)
    );
    window.addEventListener(ACCOUNT_CHANGED, (response) =>
      console.log('ACCOUNT_CHANGED', response)
    );
    window.addEventListener(NETWORK_CHANGED, (response) =>
      console.log('NETWORK_CHANGED', response)
    );
  }

  public init(): void {
    this.N2_READY_EVENT.subscribe(() => {
      this.N2_NEOLINE.next(new (window as any).NEOLine.Init());
    });
    this.N3_READY_EVENT.subscribe(() => {
      this.N3_NEOLINE.next(new (window as any).NEOLineN3.Init());
    });
  }

  public getNetworks(): Observable<NeoNetwork> {
    return this.N2_NEOLINE.pipe(switchMap((n2) => from(n2?.getNetworks())));
  }

  public getAccount(): Observable<NeoAccount> {
    return this.N2_NEOLINE.pipe(switchMap((n2) => from(n2?.getAccount())));
  }

  public getPublicKey(): Observable<NeoPublicKeyData> {
    return this.N2_NEOLINE.pipe(switchMap((n2) => from(n2?.getPublicKey())));
  }

  public invokeRead(
    scriptHash: string,
    operation: string,
    args: NeoTypedValue[],
    signers: NeoSigner[]
  ): Observable<NeoInvokeReadResponse> {
    return this.N3_NEOLINE.pipe(
      switchMap((n3) =>
        from(n3?.invokeRead(scriptHash, operation, args, signers))
      )
    );
  }

  public getBalance(): Observable<NeoGetBalanceResponse> {
    return this.N3_NEOLINE.pipe(switchMap((n3) => from(n3?.getBalance())));
  }
}
