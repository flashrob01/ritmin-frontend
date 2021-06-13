import { Component, HostListener } from '@angular/core';
import { NeoLineService } from 'src/app/services/neoline.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  address: string

  @HostListener('window:NEOLine.NEO.EVENT.READY', [])
  onNEOLineReady() {
    this.neolineService.init().then(i => {
      i.getAccount().then(acc => {
        this.address = acc.address;
      })
    })
  }

  constructor(private neolineService: NeoLineService) {}

}
