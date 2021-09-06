import {Component, OnInit} from '@angular/core';
import {WCA} from 'src/app/models/wca';
import {AdvanceQueryReqBody, WcaService} from 'src/app/services/wca.service';
import {getStatusTag} from 'src/app/utils';
import {NeolineService} from '../../services/neoline.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {

  boughtWCAs: WCA[] = [];
  createdWCAs: WCA[] = [];
  getStatusTag = getStatusTag;

  constructor(
    private wcaService: WcaService,
    private wallet: NeolineService
  ) {
  }

  ngOnInit(): void {
    const createdWCAQuery: AdvanceQueryReqBody = {
      creator: this.wallet.getAddress$().getValue(),
      buyer: null,
      page: 1,
      size: 100,
    };
    this.wcaService.filterWCA(createdWCAQuery).subscribe(res => {
      this.createdWCAs = res;

    });

    const boughtWCAQuery: AdvanceQueryReqBody = {
      creator: null,
      buyer: this.wallet.getAddress$().getValue(),
      page: 1,
      size: 100,
    };
    this.wcaService.filterWCA(boughtWCAQuery).subscribe(res => {
      this.boughtWCAs = res;

    });

  }

}
