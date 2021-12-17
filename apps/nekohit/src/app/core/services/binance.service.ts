import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import {
  BNEO_SYMBOL,
  CAT_SYMBOL,
  FLM_SYMBOL,
  FUSDT_SYMBOL,
  GAS_SYMBOL,
} from './token.service';

const BTCUSDT = 'BTCUSDT';
const GASBTC = 'GASBTC';
const FLMBTC = 'FLMBTC';
const NEOBTC = 'NEOBTC';

interface TickerRespone {
  symbol: string;
  price: number;
}
@Injectable()
export class BinanceService {
  readonly BASE_URL = 'https://api.binance.com/api/v3/';

  constructor(private http: HttpClient) {}

  public getGasPrice(): Observable<number> {
    return this.http
      .get<TickerRespone>(this.BASE_URL + 'ticker/price?symbol=' + BTCUSDT)
      .pipe(
        map((res) => res.price),
        switchMap((btcusdt) => {
          return this.http
            .get<TickerRespone>(this.BASE_URL + 'ticker/price?symbol=' + GASBTC)
            .pipe(map((res) => btcusdt * res.price));
        })
      );
  }

  public getNeoPrice(): Observable<number> {
    return this.http
      .get<TickerRespone>(this.BASE_URL + 'ticker/price?symbol=' + BTCUSDT)
      .pipe(
        map((res) => res.price),
        switchMap((btcusdt) => {
          return this.http
            .get<TickerRespone>(this.BASE_URL + 'ticker/price?symbol=' + NEOBTC)
            .pipe(map((res) => btcusdt * res.price));
        })
      );
  }

  public getFlmPrice(): Observable<number> {
    return this.http
      .get<TickerRespone>(this.BASE_URL + 'ticker/price?symbol=' + BTCUSDT)
      .pipe(
        map((res) => res.price),
        switchMap((btcusdt) => {
          return this.http
            .get<TickerRespone>(this.BASE_URL + 'ticker/price?symbol=' + FLMBTC)
            .pipe(map((res) => btcusdt * res.price));
        })
      );
  }

  public getCatPrice(): Observable<number> {
    return of(0.5);
  }

  public getfUsdtPrice(): Observable<number> {
    return of(1);
  }

  public getPrice(symbol: string) {
    if (symbol === GAS_SYMBOL) {
      return this.getGasPrice();
    }
    if (symbol === CAT_SYMBOL) {
      return this.getCatPrice();
    }
    if (symbol === FLM_SYMBOL) {
      return this.getFlmPrice();
    }
    if (symbol === BNEO_SYMBOL) {
      return this.getNeoPrice();
    }
    if (symbol === FUSDT_SYMBOL) {
      return this.getfUsdtPrice();
    }
    throw Error('no token found with symbol ' + symbol);
  }
}
