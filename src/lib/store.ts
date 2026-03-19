import { create } from 'zustand';

interface WalletState {
  btcAddress: string | null;
  btcPublicKey: string | null;
  btcBalance: number;
  stacksAddress: string | null;
  sbtcBalance: number;
  btcNetwork: string | null;
  isConnected: boolean;
  setWallet: (address: string, publicKey: string, balance: number, network: string) => void;
  setStacksAddress: (address: string) => void;
  setSbtcBalance: (balance: number) => void;
  setBtcBalance: (balance: number) => void;
  transactions: Transaction[];
  addTransaction: (tx: Transaction) => void;
  updateTransactionStatus: (txid: string, status: 'pending' | 'confirmed' | 'failed') => void;
  setBtcNetwork: (network: string) => void;
  disconnect: () => void;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'swap' | 'withdraw';
  amount: number;
  fromToken: string;
  toToken: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: string; // ISO string for persistence
  txid: string;
}

export const useWalletStore = create<WalletState>((set) => ({
  btcAddress: null,
  btcPublicKey: null,
  btcBalance: 0,
  stacksAddress: null,
  sbtcBalance: 0,
  btcNetwork: null,
  isConnected: false,
  transactions: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('btcflow_txs') || '[]') : [],
  setWallet: (address, publicKey, balance, network) =>
    set({
      btcAddress: address,
      btcPublicKey: publicKey,
      btcBalance: balance,
      btcNetwork: network,
      isConnected: true,
    }),
  setStacksAddress: (address) => set({ stacksAddress: address }),
  setSbtcBalance: (balance) => set({ sbtcBalance: balance }),
  setBtcBalance: (balance) => set({ btcBalance: balance }),
  setBtcNetwork: (network) => set({ btcNetwork: network }),
  addTransaction: (tx) => set((state) => {
    const newTxs = [tx, ...state.transactions];
    if (typeof window !== 'undefined') {
      localStorage.setItem('btcflow_txs', JSON.stringify(newTxs));
    }
    return { transactions: newTxs };
  }),
  updateTransactionStatus: (txid, status) => set((state) => {
    const newTxs = state.transactions.map(tx => 
      tx.txid === txid ? { ...tx, status } : tx
    );
    if (typeof window !== 'undefined') {
      localStorage.setItem('btcflow_txs', JSON.stringify(newTxs));
    }
    return { transactions: newTxs };
  }),
  disconnect: () =>
    set({
      btcAddress: null,
      btcPublicKey: null,
      btcBalance: 0,
      btcNetwork: null,
      stacksAddress: null,
      sbtcBalance: 0,
      isConnected: false,
    }),
}));
