import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
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
    private readonly wallet: WalletConnectService) {}

  ngOnInit() {
    const defaultQuery: AdvanceQueryReqBody = {
      creator: null,
      buyer: null,
      page: 1,
      size: 100,
    };
    this.wcaService.filterWCA(defaultQuery).subscribe(res => {
      this.wcas = res
      this.myWCAS = this.wcas.filter(wca => wca.creator === this.wallet.address$.getValue());
      console.log("myWCAS", this.myWCAS);
    });
  }

  createWCA() {
    this.wcaService.createWCA(
      {
        hash: this.wallet.address$.getValue(),
        coolDownInterval: 1,
        descriptions: ["asdf", "asdfff", "dddd"],
        endTimestamps: [343, 3434, 3434],
        identifier: "xyz",
        maxTokenSoldCount: 100,
        stakePer100Token: 5,
        thresholdIndex: 2
      }).subscribe(res => console.log(res));

  }
}
