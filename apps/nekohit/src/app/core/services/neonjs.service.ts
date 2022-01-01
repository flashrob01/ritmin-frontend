import { Inject, Injectable } from '@angular/core';
import { from, Observable, of, throwError } from 'rxjs';
import { rpc } from '@cityofzion/neon-js';
import { map, mergeMap } from 'rxjs/operators';
import { RxState } from '@rx-angular/state';
import { GlobalState, GLOBAL_RX_STATE } from '../../global.state';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { environment } from 'apps/nekohit/src/environments/environment';
@Injectable()
export class NeonJSService {
  constructor(
    @Inject(GLOBAL_RX_STATE) private globalState: RxState<GlobalState>
  ) {}
  public rpcRequest(
    method: string,
    params: any[],
    scriptHash: string
  ): Observable<any> {
    const rpcClient = new rpc.RPCClient(
      this.globalState.get('mainnet')
        ? environment.mainnet.nodeUrl
        : environment.testnet.nodeUrl
    );
    return from(rpcClient.invokeFunction(scriptHash, method, params)).pipe(
      mergeMap((res) => {
        if (res.state === 'FAULT') {
          console.error(res);
          return throwError(res.exception);
        } else return of(res);
      }),
      map((res) => res.stack[0]?.value)
    );
  }
}
