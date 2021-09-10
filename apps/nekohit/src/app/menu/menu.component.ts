import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem, SelectItem } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { LinkService } from '../core/services/link.service';

@Component({
  selector: 'ritmin-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MenuComponent implements OnInit {

  items: MenuItem[] = [];
  walletOptions: SelectItem[] = [];
  selectedWallet: SelectItem = { label: '', value: '' };

  constructor(public translate: TranslateService, private linkService: LinkService) {
    this.translate.onLangChange.subscribe((v) => {
      localStorage.setItem('lang', v.lang);
      this.items = [
        {
          label: this.translate.instant('MENU.BROWSE'),
          icon: 'pi pi-search'
        },
        {
          label: this.translate.instant('MENU.WHITEPAPER'),
          icon: 'pi pi-file-o',
          command: () => this.linkService.openWhitepaper()
        },
        {
          label: this.translate.instant('MENU.BLOG'),
          icon: 'pi pi-book',
          command: () => this.linkService.openBlog()
        },
      ];
    });
  }

  ngOnInit() {
    this.walletOptions = [
      {
        value: 'walletconnect',
        label: 'WalletConnect'
      },
      {
        value: 'neoline',
        label: 'Neoline'
      }
    ];
  }

}
