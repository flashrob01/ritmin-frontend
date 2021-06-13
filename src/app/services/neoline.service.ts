import { Injectable } from "@angular/core";

type GetBalanceArgs = { address: string; contracts: string[] };
type NeoAccount = { address: string; label: string };
type InvokeWriteArgs = {
  fee?: string;
  broadcastOverride?: boolean;
};
type InvokeReadArgs = {
  scriptHash: string;
  operation: string;
  args: TypedValue[];
};
type Signers = { signers: { account: string; scopes: number }[] };
type NeoType = "Address" | "Boolean" | "Integer";
type TypedValue = { type: NeoType; value: string | boolean };

export interface NeoLineN3Interface {
  getAccount(): Promise<NeoAccount>;

  getBalance(params: GetBalanceArgs[]): Promise<{
    [address: string]: { contract: string; symbol: string; amount: string }[];
  }>;

  invoke(params: InvokeReadArgs & InvokeWriteArgs & Signers): Promise<any>;

  invokeRead(
    params: InvokeReadArgs & Signers
  ): Promise<{ script: string; stack: TypedValue[]; state: string }>;

  // Note that the order of items in the result array is not consistent with
  // the order of the items in the input array.
  invokeReadMulti(params: {
    invokeReadArgs: InvokeReadArgs[];
    signers: { account: string; scopes: number }[];
  }): Promise<{ script: string; stack: TypedValue[]; state: string }[]>;
}

@Injectable({
  providedIn: 'root'
})
export class NeoLineService {

  public n3: NeoLineN3Interface;

  public init(): Promise<NeoLineN3Interface> {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve(new (window as any).NEOLineN3.Init());
      }, 10)
    );
  }
}
