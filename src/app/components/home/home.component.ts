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
      this.wcas = res
    });
  }

  createWCA() {
    this.wcaService.createWCA(
      {
        hash: this.wallet.address$.getValue(),
        wcaDescription: "amazing",
        coolDownInterval: 1,
        msTitles: ["asdf", "dd", "aaa"],
        msDescriptions: ["asdf", "asdfff", "dddd"],
        endTimestamps: [1656855948000, 1659534348000, 1662212748000],
        identifier: "xyz",
        maxTokenSoldCount: 100,
        stakePer100Token: 5,
        thresholdIndex: 2,
        isPublic: true
      }).subscribe(res => console.log(res));

  }
}
