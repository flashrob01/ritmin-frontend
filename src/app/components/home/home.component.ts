import { Component, OnInit } from '@angular/core';
import { WalletConnectService } from 'src/app/services/walletconnect.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private readonly walletConnectService: WalletConnectService) {}

  ngOnInit() {
    this.walletConnectService.init().pipe(
      switchMap(() => this.walletConnectService.getSession())
      ).subscribe((session: any) => {
        console.log("session", session);
        /* this.walletConnectService.connect() */;
    }, err => console.error(err));
  }

}
