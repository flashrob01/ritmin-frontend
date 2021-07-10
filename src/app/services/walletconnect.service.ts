import { Injectable } from "@angular/core";
import WalletConnectClient from "@walletconnect/client";
import { BehaviorSubject, from, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { RpcCallResult, WcSdk } from "./walletconnect";
import QRCodeModal from '@walletconnect/qrcode-modal';
import { SessionTypes } from "@walletconnect/types";
import { map } from "rxjs/operators";
import { MessageService } from "primeng/api";

@Injectable({providedIn: 'root'})
export class WalletConnectService {

  private static readonly RELAY_SERVER = environment.relayServer;

  private static readonly LOG_LEVEL = environment.walletConnectLogLevel;

  private client$: BehaviorSubject<WalletConnectClient> = new BehaviorSubject(null);

  private session$: BehaviorSubject<SessionTypes.Settled> = new BehaviorSubject(null);

  public address$: BehaviorSubject<string> = new BehaviorSubject(null);

  public isLoading = true;

  constructor(private messageService: MessageService) {
    this.session$.pipe(map(s => {
      if (!!s) {
        let adr = s.state.accounts[0];
        adr = adr.substring(0, adr.indexOf("@"))
        return adr;
      }
      return null;
    })).subscribe(adr => this.address$.next(adr));
  }

  /**
   * initialises a walletconnect client
   */
  public init(): void {
    WcSdk.initClient(
      WalletConnectService.LOG_LEVEL,
      WalletConnectService.RELAY_SERVER,
    ).then((client: WalletConnectClient) => {
      this.client$.next(client);
      this.updateSession();
    }).catch(err => {
      this.messageService.add({severity: 'error', summary: 'Error: Initialize Client', detail: err})
    })
  }

  /**
   * waits for the client to accept the connection
   */
  public connect(): void {
    this.openQRModal();
    WcSdk.connect(this.client$.getValue(), {
      chainId: environment.chainId,
      methods: ["invokefunction"],
      appMetadata: {
        name: "NekoHit",
        description: "NekoHit - A better Pateron on Neo N3",
        url: 'https://wca.nekohit.com/',
        icons: ['https://wca.nekohit.com/assets/logo.png'],
      }
    }).then(session => {
      this.session$.next(session);
    }).catch(err => {
      this.messageService.add({severity: 'error', summary: 'Error: Connect Wallet', detail: err})
    })
  }

  /**
   * updates the current session of the client
   */
  private updateSession(): void {
    this.isLoading = true;
    WcSdk.getSession(this.client$.getValue()).then(session => {
      this.session$.next(session);
      this.isLoading = false;
      if (session) {
        this.messageService.add({severity: 'success', summary: 'Success: Connect Wallet', detail: 'You have connected your wallet'})
      }
    }).catch(err => {
      this.isLoading = false;
      this.messageService.add({severity: 'error', summary: 'Error: Update Session', detail: err})
    })
  }

  /**
   * opens the wallet connect QR modal
   */
  private openQRModal(): void {
    WcSdk.subscribeToEvents(this.client$.getValue(), {
      onProposal: uri => {
        QRCodeModal.open(uri, null);
      },
      onCreated: () => {
        QRCodeModal.close();
      },
      onDeleted: () => {
        console.log("onDeleted");
        this.session$.next(null);
      }
    });
  }


  /* public sendRpcRequest(name: string, params?: any): Observable<RpcCallResult> {
    return from(WcSdk.sendRequest(this.client$.getValue(), this.session$.getValue(), environment.chainId, {
      method: name,
      params
    }));
  } */

  public invokeFunction(scriptHash: string, method: string, params: any[]): Observable<RpcCallResult> {
    return from(WcSdk.invokeFunction(this.client$.getValue(), this.session$.getValue(), environment.chainId, scriptHash, method, params));
  }

}

