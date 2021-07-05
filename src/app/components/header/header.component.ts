import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { WalletConnectService } from 'src/app/services/walletconnect.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  items: MenuItem[];

  constructor(public walletConnectService: WalletConnectService) {}

  ngOnInit(): void {
    this.items = [
      {icon: 'pi pi-search', label: 'Browse', routerLink: '/'},
      {icon: 'pi pi-question', label: 'How it works', routerLink: '/about'}
    ];
  }

  onConnectBtnClick() {
    this.walletConnectService.connect();
  }

}
