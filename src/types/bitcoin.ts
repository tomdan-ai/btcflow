export interface BitcoinProvider {
  requestAccounts(): Promise<string[]>;
  getNetwork(): Promise<string>;
  getPublicKey(): Promise<string>;
  sendBitcoin(to: string, satoshis: number): Promise<string>;
  signMessage(message: string): Promise<string>;
  request(method: string, params?: any): Promise<any>;
}

export interface XverseProvider {
  request(method: string, params?: any): Promise<any>;
}

export type WalletProvider = BitcoinProvider | XverseProvider;

declare global {
  interface Window {
    btcProvider?: BitcoinProvider;
    unisat?: BitcoinProvider;
    xverse?: BitcoinProvider;
    XverseProviders?: {
      BitcoinProvider: XverseProvider;
    };
  }
}
