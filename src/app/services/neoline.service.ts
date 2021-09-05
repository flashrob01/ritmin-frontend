import {Injectable} from '@angular/core';
import {InvokeReadArgs, NeoAccount, NeoNetwork, TxConfirmedInfo, TypedValue} from '../models/neoline';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NeolineService {
  constructor() {
    // if neoline is not found or cannot be init
    if (!NeolineService.initNeoline()) {
      // subscribe to this ready event
      window.addEventListener('NEOLine.N3.EVENT.READY', NeolineService.readyListener);
    }
  }

  private static neolineN3: any = undefined;
  public static isLoading = false;
  public static currentAddress$: BehaviorSubject<string> = new BehaviorSubject(null);
  public static currentScriptHash$: BehaviorSubject<string> = new BehaviorSubject(null);

  public static accountChangedSubject = new Subject<NeoAccount>();
  public static networkChangedSubject = new Subject<NeoNetwork>();
  public static txConfirmedSubject = new Subject<TxConfirmedInfo>();
  public static connectedSubject = new Subject<NeoAccount>();
  public static disconnectedSubject = new Subject<void>();

  private static readyListener = () => {
    // init the neoline on ready event
    NeolineService.initNeoline();
  };
  private static accountChangedListener = (result: any) => {
    // update latest account info on account changed event
    NeolineService.refreshCurrentAccount(result.detail.address);
    NeolineService.accountChangedSubject.next(result.detail);
  };
  private static networkChangedListener = (result: any) => {
    // push event on network changed event
    NeolineService.networkChangedSubject.next(result.detail);
  };
  private static txConfirmedListener = (result: any) => {
    // push the tx info confirmed in the event
    NeolineService.txConfirmedSubject.next({
      txId: result.detail.txid,
      blockHeight: result.detail.blockHeight,
      blockTime: result.detail.blockTime,
    });
  };
  private static connectedListener = (result: any) => {
    NeolineService.connectedSubject.next(result.detail);
  };
  private static disconnectedListener = () => {
    NeolineService.disconnectedSubject.next();
  };

  private static registerListeners(): void {
    window.addEventListener('NEOLine.NEO.EVENT.ACCOUNT_CHANGED', this.accountChangedListener);
    window.addEventListener('NEOLine.NEO.EVENT.NETWORK_CHANGED', this.networkChangedListener);
    window.addEventListener('NEOLine.NEO.EVENT.TRANSACTION_CONFIRMED', this.txConfirmedListener);
    window.addEventListener('NEOLine.NEO.EVENT.CONNECTED', this.connectedListener);
    window.addEventListener('NEOLine.NEO.EVENT.DISCONNECTED', this.disconnectedListener);
  }

  private static removeListeners(): void {
    window.removeEventListener('NEOLine.NEO.EVENT.ACCOUNT_CHANGED', this.accountChangedListener);
    window.removeEventListener('NEOLine.NEO.EVENT.NETWORK_CHANGED', this.networkChangedListener);
    window.removeEventListener('NEOLine.NEO.EVENT.TRANSACTION_CONFIRMED', this.txConfirmedListener);
    window.removeEventListener('NEOLine.NEO.EVENT.CONNECTED', this.connectedListener);
    window.removeEventListener('NEOLine.NEO.EVENT.DISCONNECTED', this.disconnectedListener);
  }

  public static initNeoline(): boolean {
    if (this.neolineN3) {
      return true;
    }
    try {
      this.isLoading = true;
      this.neolineN3 = new (window as any).NEOLineN3.Init();
      this.registerListeners();
      this.neolineN3.getAccount()
        .then((account: NeoAccount) => {
          if (NeolineService.currentAddress$.getValue() == null) {
            this.refreshCurrentAccount(account.address);
          }
        })
        .catch((error: any) => {
          this.neolineN3 = undefined;
          this.removeListeners();
          // rethrow the error
          throw error;
        });
      console.log('Neoline found!');
      return true;
    } catch (err) {
      console.error(err);
      console.warn('Neoline not found!');
      return false;
    } finally {
      this.isLoading = false;
    }
  }

  private static refreshCurrentAccount(address: string): void {
    if (!this.neolineN3 || this.currentAddress$.getValue() === address) {
      return;
    }
    this.currentAddress$.next(address);
    this.neolineN3.AddressToScriptHash({address})
      .then((result: any) => {
        const {scriptHash} = result;
        this.currentScriptHash$.next(scriptHash);
      })
      .catch((error: any) => {
        // flush if failed to get script hash
        this.currentAddress$.next(null);
        console.error(error);
      });
  }

  public invoke(params: InvokeReadArgs): Promise<{ txid: string, nodeUrl: string }> {
    // Reject if neoline is not found or cannot be init
    if (!NeolineService.initNeoline()) {
      return Promise.reject('Neoline not found');
    }
    // do invokeRead first, check status is halt
    return this.invokeRead(params)
      .then(result => {
        console.log(result);
        // TODO
        if (result.state !== 'HALT') {
          throw new Error('???');
        }
        // everything is ok, do the write invoke
        return NeolineService.neolineN3.invoke(
          // concat addition fields to params
          Object.assign(
            params,
            {
              fee: '0.000001',
              broadcastOverride: false,
              signers: [
                {
                  account: NeolineService.currentScriptHash$.getValue(),
                  scopes: 1 // CallByEntity
                }
              ]
            }
          )
        );
      });
  }

  public invokeRead(
    params: InvokeReadArgs
  ): Promise<{ script: string; stack: TypedValue[]; state: string }> {
    // Reject if neoline is not found or cannot be init
    if (!NeolineService.initNeoline()) {
      return Promise.reject('Neoline not found');
    }
    // do the read invoke
    return NeolineService.neolineN3.invokeRead(
      Object.assign(
        params,
        {
          signers: [
            {
              account: NeolineService.currentScriptHash$.getValue(),
              scopes: 1 // CallByEntity
            }
          ]
        }
      )
    );
  }

  public handleError(error: any): string {
    console.error(error);
    const {type, description, data} = error;
    let msg = '';
    switch (type) {
      case 'NO_PROVIDER':
        msg = 'No provider available.';
        break;
      case 'RPC_ERROR':
        msg = 'There was an error when broadcasting this transaction to the network.';
        break;
      case 'CANCELED':
        msg = 'Transaction canceled';
        break;
      default:
        msg = 'Unknown error: ' + description;
        break;
    }
    return msg;
  }

  public getAddress$(): BehaviorSubject<string> {
    return NeolineService.currentAddress$;
  }

  public isLoading(): boolean {
    return NeolineService.isLoading;
  }
}
