import { Injectable } from "@angular/core";
import WalletConnectClient from "@walletconnect/client";
import { from, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { WcSdk } from "../classes/wc";
import QRCodeModal from '@walletconnect/qrcode-modal';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class WalletConnectService {

  private static readonly COZ_RELAY_SERVER = "wss://connect.coz.io:443"; // wss://relay.walletconnect.org
  private static readonly LOG_LEVEL = "debug";

  private client: WalletConnectClient;

  public init(): Observable<WalletConnectClient> {
    return from(WcSdk.initClient(
      WalletConnectService.LOG_LEVEL,
      WalletConnectService.COZ_RELAY_SERVER,
    )).pipe(map(client => this.client = client))
  }

  public getSession(): Observable<any> {
    return from(WcSdk.getSession(this.client));
  }

  public connect(): void {
    WcSdk.connect(this.client, {
      chainId: environment.chainId,
      methods: ["invokefunction"],
      appMetadata: {
        name: "Ritmin",
        description: "Ritmin app",
        url: "https://myapplicationdescription.app/",
        icons: ["https://myapplicationdescription.app/myappicon.png"],
      }
    });
    WcSdk.subscribeToEvents(this.client, {
      onProposal: uri => {
        QRCodeModal.open(uri, null);
      }
    });
  }

}

