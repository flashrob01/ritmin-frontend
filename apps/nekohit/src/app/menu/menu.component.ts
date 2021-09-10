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

  constructor(translate: TranslateService, private linkService: LinkService) {
    translate.setDefaultLang('en');
    translate.use('en');
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
    this.items = [
      {
        label: 'Browse',
        icon: 'pi pi-search'
      },
      {
        label: 'White Paper',
        icon: 'pi pi-file-o',
        command: () => this.linkService.openWhitepaper()
      },
      {
        label: 'Blog',
        icon: 'pi pi-book',
        command: () => this.linkService.openBlog()
      },
    ];
  }

}
