import { Injectable } from "@angular/core";
import WalletConnectClient from "@walletconnect/client";
import { BehaviorSubject, from, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { RpcCallResult, WcSdk } from "../classes/wc";
import QRCodeModal from '@walletconnect/qrcode-modal';
import { SessionTypes } from "@walletconnect/types";
import { map } from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class WalletConnectService {

  private static readonly COZ_RELAY_SERVER = "wss://connect.coz.io:443"; // wss://relay.walletconnect.org

  private static readonly LOG_LEVEL = environment.walletConnectLogLevel;

  private client$: BehaviorSubject<WalletConnectClient> = new BehaviorSubject(null);

  private session$: BehaviorSubject<SessionTypes.Settled> = new BehaviorSubject(null);

  public readonly address: Observable<string> = this.session$.asObservable().pipe(
    map(s => {
      if (!!s) {
        let adr = s.state.accounts[0];
        adr = adr.substring(0, adr.indexOf("@"))
        return adr;
      }
      return null;
    })
  );

  /**
   * initialises a walletconnect client
   */
  public init(): void {
    WcSdk.initClient(
      WalletConnectService.LOG_LEVEL,
      WalletConnectService.COZ_RELAY_SERVER,
    ).then((client: WalletConnectClient) => {
      console.log("client", client);
      this.client$.next(client);
      this.updateSession();
    });
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
        url: "https://myapplicationdescription.app/",
        icons: ["https://myapplicationdescription.app/myappicon.png"],
      }
    }).then(session => {
      this.session$.next(session);
      console.log("session", session);
    })
  }

  /**
   * updates the current session of the client
   */
  private updateSession(): void {
    WcSdk.getSession(this.client$.getValue()).then(session => {
      console.log("session", session);
      this.session$.next(session);
    }).catch(err => {
      console.error(err);
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

  public sendRpcRequest(name: string, params?: any): Observable<RpcCallResult> {
    return from(WcSdk.sendRequest(this.client$.getValue(), this.session$.getValue(), environment.chainId, {
      method: name,
      params
    }));
  }

  public invokeFunction(scriptHash: string, method: string, params: any[]): Observable<RpcCallResult> {
    return from(WcSdk.invokeFunction(this.client$.getValue(), this.session$.getValue(), environment.chainId, scriptHash, method, params));
  }

}

