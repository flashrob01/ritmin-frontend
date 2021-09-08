type NeoType = 'Boolean' | 'Integer' | 'Array' | 'ByteArray' | 'String' | 'Address' | 'Hash160' | 'Hash256';

export type TypedValue = { type: NeoType; value: string | boolean | any[] };

export type InvokeReadArgs = {
  scriptHash: string;
  operation: string;
  args: TypedValue[];
};

export type InvokeWriteArgs = {
  fee?: string;
  broadcastOverride?: boolean;
};

export type NeoAccount = {
  address: string;
  label: string;
};

// chainId:
//  1 - Legacy MainNet
//  2 - Legacy TestNet
//  3 - N3 MainNet
//  4 - N3 TestNet
export type NeoNetwork = {
  networks: string[];
  chainId: 1 | 2 | 3 | 4;
  defaultNetwork: string
};

export type TxConfirmedInfo = {
  txId: string;
  blockHeight: number;
  blockTime: number;
};

export type Signers = {
  signers: Signer[];
};

export type Signer = {
  account: string;
  scopes: number
};
