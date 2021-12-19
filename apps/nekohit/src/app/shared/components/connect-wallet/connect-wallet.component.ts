import { Component, Input } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { SelectItem } from 'primeng/api';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NeolineService } from '../../../core/services/neoline.service';

interface ConnectWalletStte {
  walletOptions: SelectItem[];
  selectedWallet: SelectItem;
  placeholder: string;
}

const NeoLine: SelectItem = {
  value: 'neoline',
  label: 'NeoLine',
  disabled: false,
};

const WalletConnect: SelectItem = {
  value: 'walletconnect',
  label: 'WalletConnect',
  disabled: true,
};

const initState = {
  walletOptions: [NeoLine],
  selectedWallet: { value: null },
};

@Component({
  selector: 'ritmin-connect-wallet',
  templateUrl: './connect-wallet.component.html',
  styleUrls: ['./connect-wallet.component.scss'],
  providers: [RxState],
})
export class ConnectWalletComponent {
  state$ = this.state.select();
  clickWalletOption$: Subject<SelectItem> = new Subject();

  constructor(
    private state: RxState<ConnectWalletStte>,
    private neoline: NeolineService
  ) {
    this.state.set(initState);
    this.state.connect('selectedWallet', this.clickWalletOption$);
    this.state.hold(this.walletSelected$);
  }

  @Input() set placeholder(placeholder: string) {
    this.state.set({ placeholder });
  }

  walletSelected$ = this.clickWalletOption$.pipe(
    tap((wallet) => {
      if (wallet == NeoLine) {
        this.neoline.init();
      } else if (wallet == WalletConnect) {
        //TODO: init walletconnect
      }
    })
  );
}
