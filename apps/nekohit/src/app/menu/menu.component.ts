import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MenuItem, SelectItem } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { LinkService } from '../core/services/link.service';
import { Subject } from 'rxjs';
import { RxState } from '@rx-angular/state';
import { tap } from 'rxjs/operators';
import { NeolineService } from '../core/services/neoline.service';
import { GlobalState, GLOBAL_RX_STATE } from '../global.state';

interface MenuState {
  menuItems: MenuItem[];
  walletOptions: SelectItem[];
  selectedWallet: SelectItem;
}

const NeoLine: SelectItem = {
  value: 'neoline',
  label: 'NeoLine',
  disabled: false,
};

const WalletConnect: SelectItem = {
  value: 'walletconnect',
  label: 'WalletConnect',
  disabled: true,
};

const initState: MenuState = {
  menuItems: [],
  walletOptions: [WalletConnect, NeoLine],
  selectedWallet: { value: null },
};

@Component({
  selector: 'ritmin-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [RxState],
})
export class MenuComponent {
  clickWalletOption$: Subject<SelectItem> = new Subject();

  readonly state$ = this.state.select();
  readonly address$ = this.globalState.select('address');

  constructor(
    public translate: TranslateService,
    private linkService: LinkService,
    private state: RxState<MenuState>,
    @Inject(GLOBAL_RX_STATE) public globalState: RxState<GlobalState>,
    public neoline: NeolineService
  ) {
    this.state.hold(this.translate.onLangChange, (v) => {
      localStorage.setItem('lang', v.lang);
      this.state.set(initState);
      const items = [
        {
          label: this.translate.instant('MENU.BROWSE'),
          icon: 'pi pi-search',
          routerLink: 'browse',
        },
        {
          label: this.translate.instant('MENU.WHITEPAPER'),
          icon: 'pi pi-file-o',
          command: () => this.linkService.openWhitepaper(),
        },
        {
          label: this.translate.instant('MENU.BLOG'),
          icon: 'pi pi-book',
          command: () => this.linkService.openBlog(),
        },
      ];
      this.state.set({ menuItems: items });
      this.state.connect('selectedWallet', this.clickWalletOption$);
      this.state.hold(this.walletSelected$);
    });
  }

  walletSelected$ = this.clickWalletOption$.pipe(
    tap((wallet) => {
      if (wallet == NeoLine) {
        this.neoline.init();
      } else if (wallet == WalletConnect) {
        //TODO: init walletconnect
      }
    })
  );
}
