type NeoType =
  | 'Boolean'
  | 'Integer'
  | 'Array'
  | 'ByteArray'
  | 'String'
  | 'Address'
  | 'Hash160'
  | 'Hash256';

type NONE = 0;
type CALLED_BY_ENTRY = 1;
type CONTRACT = 16;
type CONTRACTS_GROUP = 32;
type GLOBAL = 128;

export type NeoScope =
  | NONE
  | CALLED_BY_ENTRY
  | CONTRACT
  | CONTRACTS_GROUP
  | GLOBAL;

export interface NeoTypedValue {
  type: NeoType;
  value: string | boolean | any[];
}

export interface NeoTxConfirmation {
  txId: string;
  blockHeight: number;
  blockTime: number;
}

export interface NeoSigner {
  account: string;
  scopes: NeoScope;
}

export interface NeoProvider {
  name: string;
  website: string;
  version: string;
  compatibility: string[];
  extra: any;
}

export interface NeoBalance {
  symbol: string;
  amount: string;
  contract: string;
}

export interface NeoInvokeReadResponse {
  script: string;
  state: string;
  gas_consumed: string;
  stack: NeoTypedValue[];
}

export interface NeoPickAddressResponse {
  label: string;
  address: string;
}

export interface NeoSendResponse {
  txid: string;
  nodeURL: string;
}

export interface NeoInvokeWriteResponse {
  txid: string;
  nodeURL: string;
  signedTx?: string;
}

export interface NeoInvokeArgument {
  scriptHash: string;
  operation: string;
  args: NeoTypedValue[];
}

export interface NeoSignMessageResponse {
  publicKey: string;
  data: string;
  salt: string;
  message: string;
}

export interface N3 {
  getProvider(): Promise<NeoProvider>;
  getBalance(): Promise<NeoBalance[]>;
  getStorage(scriptHash: string, key: string): Promise<string>;
  invokeRead(
    scriptHash: string,
    operation: string,
    args: NeoTypedValue[],
    signers: NeoSigner[]
  ): Promise<NeoInvokeReadResponse>;
  invokeReadMulti(
    scriptHash: string,
    operation: string,
    args: NeoTypedValue[]
  ): Promise<NeoInvokeReadResponse>;
  verifyMessage(
    message: string,
    data: string,
    publicKey: string
  ): Promise<boolean>;
  getBlock(blockHeight: number): Promise<any>;
  getTransaction(txid: string): Promise<any>;
  getApplicationLog(txid: string): Promise<any>;
  pickAddress(): Promise<NeoPickAddressResponse>;
  addressToScriptHash(address: string): Promise<string>;
  scriptHashToAddress(scriptHash: string): Promise<string>;
  // write
  send(
    fromAddress: string,
    toAddress: string,
    asset: string,
    amount: string,
    fee?: string,
    broadcastOverride?: boolean
  ): Promise<NeoSendResponse>;
  invoke(
    scriptHash: string,
    operation: string,
    args: NeoTypedValue[],
    signers: NeoSigner[],
    fee?: string,
    extraSystemFee?: string,
    broadcastOverrode?: boolean
  ): Promise<NeoInvokeWriteResponse>;
  invokeMultiple(
    fee: string,
    extraSystemFee: string,
    signers: NeoSigner[],
    invokeArgs?: NeoInvokeArgument[],
    broadcastOverride?: boolean
  ): Promise<NeoInvokeWriteResponse>;
  signMessage(message: string): Promise<NeoSignMessageResponse>;
}

export const N3READY = 'NEOLine.N3.EVENT.READY';
