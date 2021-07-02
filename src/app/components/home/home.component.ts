import { Component, OnInit } from '@angular/core';
import { mergeAll, mergeMap, tap, toArray } from 'rxjs/operators';
import { WCA } from 'src/app/models/wca';
import { AdvanceQueryReqBody, WcaService } from 'src/app/services/wca.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  wcas: WCA[] = [];
  constructor(private readonly wcaService: WcaService) {}

  ngOnInit() {
    const defaultQuery: AdvanceQueryReqBody = {
      creator: null,
      buyer: null,
      unpaid: true,
      canPurchase: true,
      onGoing: true,
      finished: false,
      page: 1,
      size: 10,
    };
    this.wcaService.filterWCA(defaultQuery).pipe(
      mergeAll(),
      mergeMap(res => this.wcaService.queryWCA(res)),
      toArray()
      ).subscribe(res => {
        this.wcas = res
      });
  }
}
