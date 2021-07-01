import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { WalletConnectService } from './services/walletconnect.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private primengConfig: PrimeNGConfig, private readonly walletConnectService: WalletConnectService) {
    this.walletConnectService.init();
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
  }

}
