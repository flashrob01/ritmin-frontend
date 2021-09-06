import {Component, OnInit} from '@angular/core';
import {PrimeNGConfig} from 'primeng/api';
import {NeolineService} from './services/neoline.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private primengConfig: PrimeNGConfig,
    private readonly neoline: NeolineService
  ) {
    // TODO
    NeolineService.accountChangedSubject.subscribe(() => {
      // refresh page if user switch to different account
      location.reload();
    });
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }

}
