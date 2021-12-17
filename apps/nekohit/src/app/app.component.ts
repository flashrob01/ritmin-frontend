import { Component, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RxState } from '@rx-angular/state';
import { map, switchMap, tap } from 'rxjs/operators';
import { LinkService } from './core/services/link.service';
import { NeolineService } from './core/services/neoline.service';
import { GlobalState, GLOBAL_RX_STATE } from './global.state';
import { N3MainNet } from '../app/core/models/n2';
import multiavatar from '@multiavatar/multiavatar';
import { environment } from '../environments/environment';
import { NotificationService } from './core/services/notification.service';
import { MessageService } from 'primeng/api';
import { BinanceService } from './core/services/binance.service';

@Component({
  selector: 'ritmin-frontend-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'nekohit';
  showPromotion = true;

  readonly getBalances$ = this.globalState.select('address').pipe(
    switchMap((address) =>
      this.neoline.getBalance().pipe(
        tap((balances) => console.log(balances)),
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
    @Inject(GLOBAL_RX_STATE) private globalState: RxState<GlobalState>,
    private neoline: NeolineService,
    public linkService: LinkService,
    translate: TranslateService,
    public notification: NotificationService,
    public messageService: MessageService
  ) {
    this.globalState.set({ mainnet: environment.mainnetDefault });
    this.globalState.connect(
      'address',
      this.neoline.getAccount().pipe(map((acc) => acc.address))
    );
    this.globalState.connect('address', this.neoline.ACCOUNT_CHANGED_EVENT$);

    this.globalState.connect(
      'mainnet',
      this.neoline
        .getNetworks()
        .pipe(map((network) => network.chainId === N3MainNet))
    );
    this.globalState.connect('balances', this.getBalances$);

    this.globalState.connect(
      'svgAvatar',
      this.globalState.select('address').pipe(map((adr) => multiavatar(adr)))
    );

    const lang = localStorage.getItem('lang');
    translate.langs = ['en'];
    if (lang && translate.langs.includes(lang)) {
      translate.use(lang).subscribe();
    } else {
      translate.use(translate.getBrowserLang()).subscribe();
    }
  }

  public onViewTransaction(tx: string): void {
    const url = this.globalState.get('mainnet')
      ? environment.mainnet.neotube
      : environment.testnet.neotube;
    this.linkService.openTransaction(tx, url);
  }
}
