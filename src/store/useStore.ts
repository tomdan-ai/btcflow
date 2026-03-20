import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';

export type Transaction = {
  id: string;
  type: 'Deposit' | 'Withdraw' | 'Swap' | 'Yield';
  amount: string;
  status: 'Confirmed' | 'Pending' | 'Processing' | 'Failed';
  date: string;
  txId: string;
  chain: 'BTC' | 'Stacks';
  details: string;
};

type Network = 'TESTNET4' | 'TESTNET3' | 'MAINNET' | 'DEVNET';

interface NetworkData {
  transactions: Transaction[];
  balances: {
    BTC: string;
    sBTC: string;
    STX: string;
    USD: string;
  };
}

const BTC_API_URLS: Record<Network, string> = {
  MAINNET: 'https://mempool.space/api',
  TESTNET4: 'https://mempool.space/testnet4/api',
  TESTNET3: 'https://mempool.space/testnet/api',
  DEVNET: 'http://localhost:3006', // Assume local bitcoind for devnet
};

const STACKS_API_URLS: Record<Network, string> = {
  MAINNET: 'https://api.mainnet.hiro.so',
  TESTNET4: 'https://api.testnet.hiro.so', // Usually same as testnet3 for Hiro
  TESTNET3: 'https://api.testnet.hiro.so',
  DEVNET: 'http://localhost:3999',
};

const INITIAL_BALANCES = {
  BTC: '0.000000',
  sBTC: '0.0000000',
  STX: '0.0',
  USD: '0.00',
};

interface AppState {
  isConnected: boolean;
  address: string | null;
  walletProvider: 'XVERSE' | 'UNISAT' | 'TURNKEY' | null;
  network: Network;
  networkData: Record<Network, NetworkData>;
  // UI-facing (synchronized with current network)
  transactions: Transaction[];
  balances: NetworkData['balances'];
  
  // Actions
  connect: (address: string, provider: 'XVERSE' | 'UNISAT' | 'TURNKEY') => void;
  syncWallet: () => Promise<void>; 
  disconnect: () => void;
  setNetwork: (network: Network) => void;
  refreshBalances: () => Promise<void>;
  addTransaction: (tx: Omit<Transaction, 'id' | 'date' | 'status'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  confirmTransaction: (id: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      isConnected: false,
      address: null,
      walletProvider: null,
      network: 'TESTNET4',
      networkData: {
        TESTNET4: { transactions: [], balances: INITIAL_BALANCES },
        TESTNET3: { transactions: [], balances: INITIAL_BALANCES },
        MAINNET: { transactions: [], balances: INITIAL_BALANCES },
        DEVNET: { transactions: [], balances: INITIAL_BALANCES },
      },
      transactions: [],
      balances: INITIAL_BALANCES,

      connect: (address, provider) => {
        console.log(`[Store] Connect Action - Provider: ${provider}, Address: ${address}`);
        set({ isConnected: true, address, walletProvider: provider });
        get().refreshBalances();
      },

      syncWallet: async () => {
        const { walletProvider } = get();
        if (!walletProvider) return;
        console.log(`[Store] Syncing with wallet provider: ${walletProvider}`);
        // Real implementation would use sats-connect or window.unisat here
      },

      disconnect: () => {
        console.log('[Store] Disconnecting');
        set({ isConnected: false, address: null, walletProvider: null });
      },

      setNetwork: (network) => {
        console.log(`[Store] Switching Network to: ${network}`);
        const data = get().networkData[network] || { transactions: [], balances: INITIAL_BALANCES };
        set({ 
          network,
          transactions: data.transactions,
          balances: data.balances
        });
        get().refreshBalances();
      },

      refreshBalances: async () => {
        const { isConnected, address, network } = get();
        if (!isConnected || !address) return;

        console.log(`[Store] Refreshing balances for ${address} on ${network}`);
        
        try {
          const btcApi = BTC_API_URLS[network];
          const stxApi = STACKS_API_URLS[network];

          // 1. Fetch BTC Balance (Mempool.space)
          // For simplicity, we assume 'address' provided to connect is the BTC address
          const btcRes = await axios.get(`${btcApi}/address/${address}`);
          const utxoStats = btcRes.data.chain_stats;
          const btcBalance = ((utxoStats.funded_txo_sum - utxoStats.spent_txo_sum) / 100000000).toFixed(6);

          // 2. Fetch Stacks Balances (Hiro API)
          // Hiro API needs the Stacks address. If we only have BTC address, this might fail unless they are the same in the wallet context.
          const stxRes = await axios.get(`${stxApi}/extended/v1/address/${address}/balances`);
          const stxBalance = (parseInt(stxRes.data.stx.balance) / 1000000).toFixed(1);
          
          // sBTC is a SIP-10 token. We'd fetch it from 'stxRes.data.fungible_tokens'
          // For now, use a placeholder or specifically search for the sBTC contract
          let sbtcBalance = '0.0000000';
          const sbtcContract = network === 'MAINNET' 
            ? 'SM3VDXK3WZZS1A699H9B2082697M8C6J71K6B66S.sbtc-token'
            : 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.sbtc-token';
          
          if (stxRes.data.fungible_tokens[sbtcContract]) {
            sbtcBalance = (parseInt(stxRes.data.fungible_tokens[sbtcContract].balance) / 100000000).toFixed(7);
          }

          const newBalances = {
            BTC: btcBalance,
            sBTC: sbtcBalance,
            STX: stxBalance,
            USD: (parseFloat(btcBalance) * 64000).toFixed(2), // Rough BTC price
          };

          set((state) => ({
            balances: newBalances,
            networkData: {
              ...state.networkData,
              [network]: {
                ...state.networkData[network],
                balances: newBalances
              }
            }
          }));

        } catch (error) {
          console.error('[Store] Failed to refresh balances:', error);
          // Keep current balances on error
        }
      },

      addTransaction: (tx) => {
        const id = `tx-${Date.now()}`;
        const newTx: Transaction = {
          ...tx,
          id,
          date: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          status: 'Pending',
        };
        console.log(`[Store] Adding Transaction to ${get().network}:`, newTx);
        
        set((state) => {
          const currentNetwork = state.network;
          const updatedTransactions = [newTx, ...state.transactions];
          return {
            transactions: updatedTransactions,
            networkData: {
              ...state.networkData,
              [currentNetwork]: {
                ...state.networkData[currentNetwork],
                transactions: updatedTransactions
              }
            }
          };
        });

        // NO MORE AUTO-CONFIRM MOCK. 
        // Real tracking would use get().refreshBalances() or a polling loop.
      },

      updateTransaction: (id, updates) => {
        set((state) => {
          const currentNetwork = state.network;
          const updatedTransactions = state.transactions.map((tx) => 
            tx.id === id ? { ...tx, ...updates } : tx
          );
          return {
            transactions: updatedTransactions,
            networkData: {
              ...state.networkData,
              [currentNetwork]: {
                ...state.networkData[currentNetwork],
                transactions: updatedTransactions
              }
            }
          };
        });
      },

      confirmTransaction: (id) => {
        // This remains for manual/poll-triggered confirmations
        const tx = get().transactions.find(t => t.id === id);
        if (!tx || tx.status === 'Confirmed') return;

        set((state) => {
          const currentNetwork = state.network;
          const updatedTransactions = state.transactions.map((t) => 
            t.id === id ? { ...t, status: 'Confirmed' as const } : t
          );

          // Balances are now fetched live via refreshBalances, 
          // but we can update local state immediately if desired.
          return {
            transactions: updatedTransactions,
            networkData: {
              ...state.networkData,
              [currentNetwork]: {
                ...state.networkData[currentNetwork],
                transactions: updatedTransactions,
              }
            }
          };
        });
        
        get().refreshBalances();
      },
    }),
    {
      name: 'btcflow-storage',
    }
  )
);
