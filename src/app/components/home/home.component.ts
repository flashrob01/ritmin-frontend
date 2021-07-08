import { Component, OnInit } from '@angular/core';
import { WCA } from 'src/app/models/wca';
import { WalletConnectService } from 'src/app/services/walletconnect.service';
import { AdvanceQueryReqBody, WcaService } from 'src/app/services/wca.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  wcas: WCA[] = [];
  myWCAS: WCA[] = [];

  constructor(
    private readonly wcaService: WcaService,
    public readonly wallet: WalletConnectService) {}

  ngOnInit() {
    const defaultQuery: AdvanceQueryReqBody = {
      creator: null,
      buyer: null,
      page: 1,
      size: 100,
    };
    this.wcaService.filterWCA(defaultQuery).subscribe(res => {
      this.wcas = res;
    });
  }
}
