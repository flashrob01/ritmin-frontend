import {Component, OnInit} from '@angular/core';
import {PrimeNGConfig} from 'primeng/api';
import {NeolineService} from './services/neoline.service';
import {WcaService} from './services/wca.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private primengConfig: PrimeNGConfig,
  ) {
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }

}
