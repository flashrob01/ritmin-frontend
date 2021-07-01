import { Component, OnInit } from '@angular/core';
import { QueryRequest, WcaService } from 'src/app/services/wca.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private readonly wcaService: WcaService) {}

  ngOnInit() {}

  onQueryAllClick() {
    const q: QueryRequest = {
      creator: null,
      buyer: null,
      unpaid: true,
      canPurchase: true,
      onGoing: true,
      finished: false,
      page: 1,
      size: 10,
    }
    this.wcaService.advanceQuery(q).subscribe(r => console.log(r));
  }

}
