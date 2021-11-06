import { InjectionToken } from '@angular/core';
import { RxState } from '@rx-angular/state';

export interface GlobalState {
  address: string;
  mainnet: boolean;
  catBalance: number;
  svgAvatar: string;
  catPrice: number;
  gasPrice: number;
}

export const GLOBAL_RX_STATE = new InjectionToken<RxState<GlobalState>>(
  'GLOBAL_RX_STATE'
);
