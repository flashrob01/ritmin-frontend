import { Component, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RxState } from '@rx-angular/state';
import { map, switchMap, tap } from 'rxjs/operators';
import { LinkService } from './core/services/link.service';
import { NeolineService } from './core/services/neoline.service';
import { GlobalState, GLOBAL_RX_STATE } from './global.state';
import { N3MainNet, N3TestNet } from '../app/core/models/n2';
import multiavatar from '@multiavatar/multiavatar';
import { environment } from '../environments/environment';
import { NotificationService } from './core/services/notification.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'ritmin-frontend-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'nekohit';
  showPromotion = false;
  displayWrongNetwork = false;

  readonly getBalances$ = this.globalState.select('address').pipe(
    switchMap((address) =>
      this.neoline.getBalance().pipe(
        map((balances) => {
          const res = balances[address];
          const result: { [symbol: string]: number } = {};
          res?.forEach((v) => {
            result[v.symbol] = +v.amount;
          });
          return result;
        })
      )
    )
  );
  constructor(
    @Inject(GLOBAL_RX_STATE) public globalState: RxState<GlobalState>,
    private neoline: NeolineService,
    public linkService: LinkService,
    translate: TranslateService,
    public notification: NotificationService,
    public messageService: MessageService
  ) {
    console.log('host', window.location.host);
    const mainnet = window.location.host.includes('nekohit.com');
    this.globalState.set({ mainnet: mainnet });
    this.globalState.connect(
      'address',
      this.neoline.getAccount().pipe(map((acc) => acc.address))
    );
    this.globalState.connect('address', this.neoline.ACCOUNT_CHANGED_EVENT$);
    this.globalState.connect(
      'mainnet',
      this.neoline.NETWORK_CHANGED_EVENT$.pipe(
        tap((res: any) => {
          const isMainnet = window.location.host.includes('nekohit.com');
          this.toggleWrongNetworkDialog(res, isMainnet);
        }),
        map((res: any) => res.chainId === N3MainNet)
      )
    );

    this.globalState.connect(
      'mainnet',
      this.neoline.getNetworks().pipe(
        tap((network) => this.toggleWrongNetworkDialog(network, mainnet)),
        map((network) => network.chainId === N3MainNet)
      )
    );

    this.globalState.connect(
      'svgAvatar',
      this.globalState.select('address').pipe(map((adr) => multiavatar(adr)))
    );
    this.globalState.connect('balances', this.getBalances$);

    const lang = localStorage.getItem('lang');
    translate.langs = ['en'];
    if (lang && translate.langs.includes(lang)) {
      translate.use(lang).subscribe();
    } else {
      //translate.use(translate.getBrowserLang()).subscribe();
      translate.use('en').subscribe();
    }
  }

  private toggleWrongNetworkDialog(res: any, mainnet: boolean): void {
    if (
      (res.chainId === N3MainNet && !mainnet) ||
      (res.chainId === N3TestNet && mainnet) ||
      (res.chainId !== N3MainNet && res.chainId !== N3TestNet)
    ) {
      this.displayWrongNetwork = true;
    } else {
      this.displayWrongNetwork = false;
    }
  }

  public onViewTransaction(tx: string): void {
    const url = this.globalState.get('mainnet')
      ? environment.mainnet.neotube
      : environment.testnet.neotube;
    this.linkService.openTransaction(tx, url);
  }
}
