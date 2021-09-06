import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem, SelectItem } from 'primeng/api';

@Component({
  selector: 'ritmin-frontend-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MenuComponent implements OnInit {

  items: MenuItem[] = [];
  walletOptions: SelectItem[] = [];
  selectedWallet: SelectItem = { label: '', value: '' };

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
        label: 'Whitepaper',
        icon: 'pi pi-file-o'
      }
    ];
}

}
