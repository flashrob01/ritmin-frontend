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

  constructor(private walletConnectService: WalletConnectService) { }

  ngOnInit(): void {
    this.items = [];
  }

  onConnectBtnClick() {
    this.walletConnectService.connect();
  }

}
