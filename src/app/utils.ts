import {NeolineService} from './services/neoline.service';
import {environment} from '../environments/environment';
import {rpc} from '@cityofzion/neon-js';

export function getStatusTag(status: string): string {
  switch (status) {
    case 'PENDING':
      return 'warning';
    case 'Open':
      return 'info';
    case 'ONGOING':
    case 'Active':
      return 'success';
    case 'FINISHED':
    case 'Ready-To-Finish':
      return 'danger';
  }
}

export function getWcaContractAddress(): string {
  if (NeolineService.isMainNet) {
    return undefined;
  } else {
    return environment.testNetWcaContractHash;
  }
}

export function getCatContractAddress(): string {
  if (NeolineService.isMainNet) {
    return undefined;
  } else {
    return environment.testNetCatTokenHash;
  }
}

export function getUsdtContractAddress(): string {
  if (NeolineService.isMainNet) {
    return undefined;
  } else {
    return environment.testNetFlamingoUsdtTokenHash;
  }
}

const TEST_NET_RPC_CLIENT = new rpc.RPCClient(environment.testNetNodeUrl);

// tslint:disable-next-line:typedef
export function getRpcNode() {
  if (NeolineService.isMainNet) {
    return undefined;
  } else {
    return TEST_NET_RPC_CLIENT;
  }
}
