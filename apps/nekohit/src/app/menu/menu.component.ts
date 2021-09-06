import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem, SelectItem } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

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

  constructor(translate: TranslateService) {
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
        command: () => this.openWhitepaper()
      }
    ];
  }

  private openWhitepaper(): void {
    window.open('https://github.com/NekoHitDev/whitepaper/tags', '_blank');
  }

}
