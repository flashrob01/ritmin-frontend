import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

const BTCUSDT = 'BTCUSDT';
const GASBTC = 'GASBTC';

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
}
