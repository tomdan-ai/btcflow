'use client';

import { useEffect, useState } from 'react';
import { useWalletStore } from '@/lib/store';
import { getBtcBalance } from '@/lib/bitcoin';
import { checkSbtcBalance, pollBtcConfirmations } from '@/lib/deposit';
import DepositWizard from './DepositWizard';
import WithdrawWizard from './WithdrawWizard';
import SwapPanel from './SwapPanel';
import DeFiProtocols from './DeFiProtocols';
import TransactionHistory from './TransactionHistory';

export default function Dashboard() {
  const { btcAddress, btcBalance, sbtcBalance, stacksAddress, btcNetwork, isConnected, setBtcBalance, setSbtcBalance, setBtcNetwork } =
    useWalletStore();
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw' | 'swap' | 'defi' | 'history'>('deposit');
  const [showWithdraw, setShowWithdraw] = useState(false);

  useEffect(() => {
    if (!isConnected || !btcAddress) return;

    const pollBalances = async () => {
      try {
        const btcBal = await getBtcBalance(btcAddress, btcNetwork || 'testnet');
        setBtcBalance(btcBal);

        // Check pending transactions status to auto-confirm demo sBTC
        const state = useWalletStore.getState();
        for (const tx of state.transactions) {
          if (tx.status === 'pending' && tx.type === 'deposit') {
            console.log(`Checking status for pending deposit: ${tx.txid}`);
            const confirmations = await pollBtcConfirmations(tx.txid);
            if (confirmations >= 1) {
              console.log(`Deposit ${tx.txid} confirmed! Updating status.`);
              state.updateTransactionStatus(tx.txid, 'confirmed');
            }
          }
        }

        if (stacksAddress && stacksAddress.startsWith('ST')) {
          const sbtcBal = await checkSbtcBalance(stacksAddress);
          setSbtcBalance(sbtcBal);
        }
      } catch (error) {
        console.error('Error polling balances:', error);
      }
    };

    pollBalances();
    const interval = setInterval(pollBalances, 30000); // Poll every 30s

    return () => clearInterval(interval);
  }, [isConnected, btcAddress, stacksAddress, btcNetwork, setBtcBalance, setSbtcBalance]);

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Connect your wallet to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Balances Snippet */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 relative">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-gray-400 text-sm font-semibold">Bitcoin Balance</h3>
            <select 
              value={btcNetwork || 'testnet'} 
              onChange={(e) => setBtcNetwork(e.target.value)}
              className="text-xs bg-gray-700 border border-gray-600 rounded px-1 py-0.5 text-gray-300 outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="testnet">Testnet3</option>
              <option value="testnet4">Testnet4</option>
              <option value="signet">Signet</option>
            </select>
          </div>
          <p className="text-3xl font-bold text-orange-500">{btcBalance.toFixed(6)} BTC</p>
          <p className="text-xs text-gray-500 mt-2">{btcAddress?.slice(0, 16)}...</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-gray-400 text-sm font-semibold mb-2">sBTC Balance</h3>
          <p className="text-3xl font-bold text-blue-500">{sbtcBalance.toFixed(6)} sBTC</p>
          <p className="text-xs text-gray-500 mt-2">{stacksAddress?.slice(0, 16)}...</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg">
        <div className="flex border-b border-gray-700 overflow-x-auto">
          {['deposit', 'withdraw', 'swap', 'defi', 'history'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 min-w-[100px] px-4 py-4 font-semibold transition uppercase text-xs tracking-wider ${
                activeTab === tab
                  ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-400/5'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'deposit' && <DepositWizard />}
          {activeTab === 'withdraw' && <WithdrawWizard onClose={() => setActiveTab('history')} />}
          {activeTab === 'swap' && <SwapPanel />}
          {activeTab === 'defi' && <DeFiProtocols />}
          {activeTab === 'history' && <TransactionHistory />}
        </div>
      </div>
    </div>
  );
}
