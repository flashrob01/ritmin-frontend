import { Inject, Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { rpc } from '@cityofzion/neon-js';
import { environment } from 'apps/nekohit/src/environments/environment';
import { map } from 'rxjs/operators';
import { RxState } from '@rx-angular/state';
import { GlobalState, GLOBAL_RX_STATE } from '../../global.state';

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
        ? environment.mainNetNodeUrl
        : environment.testNetNodeUrl
    );
    return from(rpcClient.invokeFunction(scriptHash, method, params)).pipe(
      map((resp) => resp.stack[0]?.value as string)
    );
  }
}
