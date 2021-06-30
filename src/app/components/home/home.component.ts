import { Component, OnInit } from '@angular/core';
import { WalletConnectService } from 'src/app/services/walletconnect.service';
import { switchMap } from 'rxjs/operators';
import { WcaService } from 'src/app/services/wca.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private readonly walletConnectService: WalletConnectService, private readonly wcaService: WcaService) {}

  ngOnInit() {
    this.walletConnectService.init().pipe(
      switchMap(() => this.walletConnectService.getSession())
      ).subscribe();
    }

    onQueryAllClick() {
      this.wcaService.advanceQuery().subscribe(r => console.log(r));
    }

}
