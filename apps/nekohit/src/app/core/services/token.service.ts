import { Inject, Injectable } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { GlobalState, GLOBAL_RX_STATE } from '../../global.state';

export const CAT_DECIMALS = 2;
export const GAS_DECIMALS = 8;
export const FLM_DECIMALS = 8;
export const BNEO_DECIMALS = 8;
export const FUSDT_DECIMALS = 6;

export const CAT_SYMBOL = 'CAT';
export const GAS_SYMBOL = 'GAS';
export const FLM_SYMBOL = 'FLM';
export const BNEO_SYMBOL = 'bNEO';
export const FUSDT_SYMBOL = 'fUSDT';

export interface Token {
  hash: string;
  symbol: string;
  decimals: number;
}

@Injectable()
export class TokenService {
  constructor(
    @Inject(GLOBAL_RX_STATE) private globalState: RxState<GlobalState>
  ) {}

  public getTokens(): Token[] {
    const gas = this.globalState.get('mainnet')
      ? environment.mainnet.tokens.gas
      : environment.testnet.tokens.gas;
    const cat = this.globalState.get('mainnet')
      ? environment.mainnet.tokens.cat
      : environment.testnet.tokens.cat;
    const flm = this.globalState.get('mainnet')
      ? environment.mainnet.tokens.flm
      : environment.testnet.tokens.flm;
    const bneo = this.globalState.get('mainnet')
      ? environment.mainnet.tokens.bneo
      : environment.testnet.tokens.bneo;
    const fusdt = this.globalState.get('mainnet')
      ? environment.mainnet.tokens.fusdt
      : environment.testnet.tokens.fusdt;

    return [
      {
        decimals: GAS_DECIMALS,
        hash: gas,
        symbol: GAS_SYMBOL,
      },
      {
        decimals: CAT_DECIMALS,
        hash: cat,
        symbol: CAT_SYMBOL,
      },
      {
        decimals: FLM_DECIMALS,
        hash: flm,
        symbol: FLM_SYMBOL,
      },
      {
        decimals: BNEO_DECIMALS,
        hash: bneo,
        symbol: BNEO_SYMBOL,
      },
      {
        decimals: FUSDT_DECIMALS,
        hash: fusdt,
        symbol: FUSDT_SYMBOL,
      },
    ];
  }

  public getTokenBySymbol(symbol: string | undefined): Token {
    if (symbol === undefined) {
      throw new Error('symbol is undefined');
    }
    const result = this.getTokens().filter((token) => token.symbol === symbol);
    if (result.length === 0) {
      throw new Error('no such token with symbol ' + symbol);
    }
    return result[0];
  }

  public getTokenByHash(hash: string): Token {
    const result = this.getTokens().filter((token) =>
      token.hash.includes(hash)
    );
    if (result.length === 0) {
      throw new Error('no such token with hash ' + hash);
    }
    return result[0];
  }
}
