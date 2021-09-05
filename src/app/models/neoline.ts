type NeoType = 'Boolean' | 'Integer' | 'Array' | 'ByteArray' | 'String' | 'Address' | 'Hash160' | 'Hash256';

type TypedValue = { type: NeoType; value: string | boolean | any[] };

type InvokeReadArgs = {
  scriptHash: string;
  operation: string;
  args: TypedValue[];
};

type InvokeWriteArgs = {
  fee?: string;
  broadcastOverride?: boolean;
};

type NeoAccount = {
  address: string;
  label: string;
};

// chainId:
//  1 - Legacy MainNet
//  2 - Legacy TestNet
//  3 - N3 MainNet
//  4 - N3 TestNet
type NeoNetwork = {
  networks: string[];
  chainId: 1 | 2 | 3 | 4;
  defaultNetwork: string
};

type TxConfirmedInfo = {
  txId: string;
  blockHeight: number;
  blockTime: number;
};

type Signers = {
  signers: Signer[];
};

type Signer = {
  account: string;
  scopes: number
};

export type {
  InvokeReadArgs, InvokeWriteArgs, NeoAccount, NeoNetwork, Signers, Signer, TypedValue,
  TxConfirmedInfo,
};
