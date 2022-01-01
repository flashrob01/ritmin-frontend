import { Inject, Injectable } from '@angular/core';
import { NeolineService } from '../../core/services/neoline.service';
import { GlobalState, GLOBAL_RX_STATE } from '../../global.state';
import { RxState } from '@rx-angular/state';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { NeoInvokeWriteResponse } from '../../core/models/n3';
import { ErrorService } from '../../core/services/error.service';

@Injectable()
export class ExchangeService {
  constructor(
    private neolineService: NeolineService,
    @Inject(GLOBAL_RX_STATE) private globalState: RxState<GlobalState>,
    private errorService: ErrorService
  ) {}

  public mint(amount: number): Observable<NeoInvokeWriteResponse> {
    const cat = this.globalState.get('mainnet')
      ? environment.mainnet.tokens.cat
      : environment.testnet.tokens.cat;

    const fusdt = this.globalState.get('mainnet')
      ? environment.mainnet.tokens.fusdt
      : environment.testnet.tokens.fusdt;

    return this.neolineService
      .addressToScriptHash(this.globalState.get('address'))
      .pipe(
        map((result) => result.scriptHash),
        switchMap((address) => {
          return this.neolineService.invoke(
            fusdt,
            'transfer',
            [
              NeolineService.address(address),
              NeolineService.hash160(cat),
              NeolineService.int(amount),
              NeolineService.bool(false),
            ],
            [{ account: address, scopes: 1 }]
          );
        }),
        catchError((err) => {
          return this.errorService.handleError(err);
        })
      );
  }

  public destroy(amount: number): Observable<NeoInvokeWriteResponse> {
    const cat = this.globalState.get('mainnet')
      ? environment.mainnet.tokens.cat
      : environment.testnet.tokens.cat;

    return this.neolineService
      .addressToScriptHash(this.globalState.get('address'))
      .pipe(
        map((result) => result.scriptHash),
        switchMap((address) => {
          return this.neolineService.invoke(
            cat,
            'destroyToken',
            [NeolineService.address(address), NeolineService.int(amount)],
            [{ account: address, scopes: 1 }]
          );
        }),
        catchError((err) => {
          return this.errorService.handleError(err);
        })
      );
  }
}
