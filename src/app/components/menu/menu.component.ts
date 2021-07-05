import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { WalletConnectService } from 'src/app/services/walletconnect.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  items: MenuItem[];

  constructor(public walletConnectService: WalletConnectService) {}

  ngOnInit(): void {
    this.items = [
      {icon: 'pi pi-search', label: 'Browse', routerLink: '/'},
      {icon: 'pi pi-plus', label: 'Create', routerLink: 'new'},
      {icon: 'pi pi-question', label: 'How it works', routerLink: 'about'},
    ];
  }

  onConnectBtnClick() {
    this.walletConnectService.connect();
  }

}
