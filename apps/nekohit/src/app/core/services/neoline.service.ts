import { Injectable } from '@angular/core';
import { from, Observable, ReplaySubject, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
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
  NeoGetBalanceResponse,
  NeoInvokeWriteResponse,
  NeoPickAddressResponse,
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

  public static bool(value: boolean): NeoTypedValue {
    return { type: 'Boolean', value };
  }

  public static int(value: number): NeoTypedValue {
    return { type: 'Integer', value: value.toString() };
  }

  public static array(value: any[]): NeoTypedValue {
    return { type: 'Array', value };
  }

  public static byteArray(value: string[]): NeoTypedValue {
    return { type: 'ByteArray', value };
  }

  public static string(value: string): NeoTypedValue {
    return { type: 'String', value };
  }

  public static address(value: string): NeoTypedValue {
    return { type: 'Address', value };
  }

  public static hash160(value: string): NeoTypedValue {
    return { type: 'Hash160', value };
  }

  public static hash256(value: string): NeoTypedValue {
    return { type: 'Hash256', value };
  }

  constructor() {
    // this.registerListeners();
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
    let n2;
    let n3;
    this.N2_READY_EVENT.subscribe(() => {
      n2 = new (window as any).NEOLine.Init();
      if (!n2) {
        console.error('common dAPI method failed to load');
      } else {
        this.N2_NEOLINE.next(n2);
      }
    });
    this.N3_READY_EVENT.subscribe(() => {
      n3 = new (window as any).NEOLineN3.Init();
      if (!n3) {
        console.error('N3 dAPI method failed to load');
      } else {
        this.N3_NEOLINE.next(n3);
      }
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
    signers: NeoSigner[],
    fee?: string,
    extraSystemFee?: string,
    broadcastOverride?: boolean
  ): Observable<NeoInvokeWriteResponse> {
    return this.N3_NEOLINE.pipe(
      switchMap((n3) =>
        from(
          n3?.invokeRead({
            scriptHash,
            operation,
            args,
            signers,
          })
        ).pipe(
          tap((res) => {
            if (res.state === 'FAULT') {
              throwError(res.exception);
            }
          }),
          switchMap(() =>
            n3?.invoke({
              scriptHash,
              operation,
              args,
              fee,
              extraSystemFee,
              broadcastOverride,
              signers,
            })
          )
        )
      )
    );
  }

  public pickAddress(): Observable<NeoPickAddressResponse> {
    return this.N3_NEOLINE.pipe(switchMap((n3) => from(n3?.pickAddress())));
  }

  public getBalance(): Observable<NeoGetBalanceResponse> {
    return this.N3_NEOLINE.pipe(switchMap((n3) => from(n3?.getBalance())));
  }
}
