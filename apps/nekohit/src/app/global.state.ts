import { InjectionToken } from '@angular/core';
import { RxState } from '@rx-angular/state';

export interface GlobalState {
  address: string;
  mainnet: boolean;
  svgAvatar: string;
  balances: { [symbol: string]: number };
}

export const GLOBAL_RX_STATE = new InjectionToken<RxState<GlobalState>>(
  'GLOBAL_RX_STATE'
);
