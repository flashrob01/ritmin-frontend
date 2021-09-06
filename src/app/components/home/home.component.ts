import {Component, OnInit} from '@angular/core';
import {WCA} from 'src/app/models/wca';
import {AdvanceQueryReqBody, WcaService} from 'src/app/services/wca.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  wcas: WCA[] = [];

  constructor(
    private readonly wcaService: WcaService,
  ) {
  }

  ngOnInit(): void {
    // TODO what if we have thousand of project?
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
