'use client';

import { useState } from 'react';
import { useWalletStore } from '@/lib/store';
import { generateDepositAddress, monitorDeposit } from '@/lib/deposit';
import type { BitcoinProvider } from '@/types/bitcoin';

interface DepositStep {
  status: 'idle' | 'pending' | 'confirming' | 'minting' | 'complete' | 'error';
  confirmations: number;
  txid?: string;
  depositAddress?: string;
  error?: string;
}

export default function DepositWizard() {
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<DepositStep>({
    status: 'idle',
    confirmations: 0,
  });
  const { btcAddress, stacksAddress, isConnected, setSbtcBalance } = useWalletStore();

  const handleDeposit = async () => {
    if (!amount || !btcAddress || !stacksAddress) {
      setStep({
        status: 'error',
        confirmations: 0,
        error: 'Missing wallet information',
      });
      return;
    }

    setStep({ status: 'pending', confirmations: 0 });

    try {
      // Step 1: Generate deposit address
      console.log('Generating deposit address...');
      const depositInfo = await generateDepositAddress(stacksAddress);
      console.log('Deposit address:', depositInfo.address);

      setStep({
        status: 'pending',
        confirmations: 0,
        depositAddress: depositInfo.address,
      });

      // Step 2: Request BTC transaction from wallet
      console.log('Requesting BTC transaction...');
      const provider = window.unisat as BitcoinProvider;

      const txid = await provider.sendBitcoin(
        depositInfo.address,
        Math.floor(parseFloat(amount) * 100000000) // Convert BTC to satoshis
      );

      console.log('Transaction sent:', txid);
      
      // Add to history
      useWalletStore.getState().addTransaction({
        id: Math.random().toString(36).substring(7),
        type: 'deposit',
        amount: parseFloat(amount),
        fromToken: 'BTC',
        toToken: 'sBTC',
        status: 'pending',
        timestamp: new Date().toISOString(),
        txid: txid,
      });

      setStep({
        status: 'confirming',
        confirmations: 0,
        txid,
        depositAddress: depositInfo.address,
      });

      // Step 3: Monitor deposit progress
      const success = await monitorDeposit(txid, stacksAddress, (status, confirmations) => {
        setStep({
          status: status as any,
          confirmations,
          txid,
          depositAddress: depositInfo.address,
        });
      });

      if (success) {
        // Update dashboard balance
        setSbtcBalance(parseFloat(amount));

        setStep({
          status: 'complete',
          confirmations: 6,
          txid,
          depositAddress: depositInfo.address,
        });
      } else {
        throw new Error('Deposit monitoring timed out');
      }
    } catch (error) {
      console.error('Deposit error:', error);
      setStep({
        status: 'error',
        confirmations: 0,
        error: error instanceof Error ? error.message : 'Deposit failed',
      });
    }
  };

  if (!isConnected) {
    return <p className="text-gray-400">Connect wallet to deposit</p>;
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Amount (BTC)</label>
        <input
          type="number"
          step="0.00000001"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.01"
          disabled={step.status !== 'idle'}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
        />
      </div>

      {step.status === 'idle' && (
        <button
          onClick={handleDeposit}
          disabled={!amount}
          className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 font-semibold"
        >
          Deposit BTC
        </button>
      )}

      {step.status === 'pending' && (
        <div className="p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg">
          <p className="text-sm text-yellow-300">Broadcasting transaction...</p>
          {step.depositAddress && (
            <p className="text-xs text-yellow-400 mt-2 break-all">
              Deposit to: {step.depositAddress}
            </p>
          )}
        </div>
      )}

      {step.status === 'confirming' && (
        <div className="p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
          <p className="text-sm text-blue-300">
            Confirming: {step.confirmations}/6 confirmations
          </p>
          <div className="mt-2 w-full bg-blue-900 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${(step.confirmations / 6) * 100}%` }}
            />
          </div>
          {step.txid && (
            <p className="text-xs text-blue-400 mt-2 break-all">TXID: {step.txid}</p>
          )}
        </div>
      )}

      {step.status === 'minting' && (
        <div className="p-4 bg-purple-900/30 border border-purple-700 rounded-lg">
          <p className="text-sm text-purple-300">Minting sBTC...</p>
          <p className="text-xs text-purple-400 mt-2">
            Confirmations: {step.confirmations}/6
          </p>
        </div>
      )}

      {step.status === 'complete' && (
        <div className="p-4 bg-green-900/30 border border-green-700 rounded-lg">
          <p className="text-sm text-green-300">✓ Deposit complete!</p>
          {step.txid && (
            <p className="text-xs text-green-400 mt-2 break-all">TXID: {step.txid}</p>
          )}
          <p className="text-xs text-green-400 mt-1">
            sBTC balance updated in dashboard
          </p>
        </div>
      )}

      {step.status === 'error' && (
        <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg">
          <p className="text-sm text-red-300">{step.error}</p>
          <button
            onClick={() => setStep({ status: 'idle', confirmations: 0 })}
            className="mt-2 text-xs text-red-400 hover:text-red-300 underline"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
