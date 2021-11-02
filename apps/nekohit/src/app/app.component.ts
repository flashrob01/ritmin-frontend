import { Component, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RxState } from '@rx-angular/state';
import { map, switchMap } from 'rxjs/operators';
import { LinkService } from './core/services/link.service';
import { NeolineService } from './core/services/neoline.service';
import { GlobalState, GLOBAL_RX_STATE } from './global.state';
import { N3MainNet } from '../app/core/models/n2';
import multiavatar from '@multiavatar/multiavatar';
import { environment } from '../environments/environment';

@Component({
  selector: 'ritmin-frontend-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'nekohit';
  showPromotion = true;

  readonly getCatBalance$ = this.globalState.select('address').pipe(
    switchMap((address) =>
      this.neoline.getBalance().pipe(
        map((balances) => {
          const res = balances[address]?.filter(
            (balance) => balance.symbol === 'CAT'
          );
          if (!res || !res.length) {
            return 0;
          }
          return +res[0].amount;
        })
      )
    )
  );
  constructor(
    @Inject(GLOBAL_RX_STATE) private globalState: RxState<GlobalState>,
    private neoline: NeolineService,
    public linkService: LinkService,
    translate: TranslateService
  ) {
    this.globalState.set({ mainnet: environment.mainNetIsDefault });
    this.globalState.connect(
      'address',
      this.neoline.getAccount().pipe(map((acc) => acc.address))
    );
    this.globalState.connect(
      'mainnet',
      this.neoline
        .getNetworks()
        .pipe(map((network) => network.chainId === N3MainNet))
    );
    this.globalState.connect('catBalance', this.getCatBalance$);

    this.globalState.connect(
      'svgAvatar',
      this.globalState.select('address').pipe(map((adr) => multiavatar(adr)))
    );

    const lang = localStorage.getItem('lang');
    translate.langs = ['en', 'de', 'cn'];
    if (lang && translate.langs.includes(lang)) {
      translate.use(lang).subscribe();
    } else {
      translate.use(translate.getBrowserLang()).subscribe();
    }
  }
}
