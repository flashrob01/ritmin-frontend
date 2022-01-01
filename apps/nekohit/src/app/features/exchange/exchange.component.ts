import { Component, Inject } from '@angular/core';
import { NotificationService } from '../../core/services/notification.service';
import { GlobalState, GLOBAL_RX_STATE } from '../../global.state';
import { ExchangeService } from './exchange.service';
import { RxState } from '@rx-angular/state';

@Component({
  selector: 'ritmin-exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.css'],
})
export class ExchangeComponent {
  mintAmount = 0;
  burnAmount = 0;

  constructor(
    private exchange: ExchangeService,
    private notification: NotificationService,
    @Inject(GLOBAL_RX_STATE) public globalState: RxState<GlobalState>
  ) {}

  mint(): void {
    this.exchange.mint(this.mintAmount * 100 * 5000).subscribe((res) => {
      this.notification.tx(res.txid);
    });
  }

  destroy(): void {
    this.exchange.destroy(this.burnAmount * 100).subscribe((res) => {
      this.notification.tx(res.txid);
    });
  }
}
