import { Component, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RxState } from '@rx-angular/state';
import { map, tap } from 'rxjs/operators';
import { LinkService } from './core/services/link.service';
import { NeolineService } from './core/services/neoline.service';
import { GlobalState, GLOBAL_RX_STATE } from './global.state';
import { N3MainNet } from '../app/core/models/n2';

@Component({
  selector: 'ritmin-frontend-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'nekohit';
  showPromotion = true;

  constructor(
    @Inject(GLOBAL_RX_STATE) private globalState: RxState<GlobalState>,
    private neoline: NeolineService,
    public linkService: LinkService,
    translate: TranslateService
  ) {
    this.globalState.connect(
      'address',
      this.neoline.getAccount().pipe(
        tap((acc) => console.log('global-state, getAccount()', acc)),
        map((acc) => acc.address)
      )
    );
    this.globalState.connect(
      'mainnet',
      this.neoline.getNetworks().pipe(
        tap((network) => console.log('global-state, getNetworks()', network)),
        map((network) => network.chainId === N3MainNet)
      )
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
