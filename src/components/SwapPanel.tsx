'use client';

import { useState, useEffect } from 'react';
import { useWalletStore } from '@/lib/store';
import { getSwapQuote, buildSwapTransaction, executeSwap } from '@/lib/swap';
import type { BitcoinProvider } from '@/types/bitcoin';

interface SwapStep {
  status: 'idle' | 'quoting' | 'pending' | 'executing' | 'complete' | 'error';
  amountIn: number;
  amountOut: number;
  fee: number;
  txid?: string;
  error?: string;
}

export default function SwapPanel() {
  const [amount, setAmount] = useState('');
  const [fromToken, setFromToken] = useState<'sBTC' | 'STX'>('sBTC');
  const [toToken, setToToken] = useState<'sBTC' | 'STX'>('STX');
  const [step, setStep] = useState<SwapStep>({
    status: 'idle',
    amountIn: 0,
    amountOut: 0,
    fee: 0,
  });

  const { sbtcBalance, stacksAddress, isConnected } = useWalletStore();

  // Get quote when amount changes
  useEffect(() => {
    if (!amount || step.status !== 'idle') return;

    const getQuote = async () => {
      try {
        setStep((prev) => ({ ...prev, status: 'quoting' }));
        const quote = await getSwapQuote(parseFloat(amount), fromToken, toToken);
        setStep({
          status: 'idle',
          amountIn: parseFloat(amount),
          amountOut: quote.amountOut,
          fee: quote.fee,
        });
      } catch (error) {
        console.error('Error getting quote:', error);
        setStep({
          status: 'error',
          amountIn: 0,
          amountOut: 0,
          fee: 0,
          error: 'Failed to get swap quote',
        });
      }
    };

    const timer = setTimeout(getQuote, 500);
    return () => clearTimeout(timer);
  }, [amount, fromToken, toToken]);

  const handleSwap = async () => {
    if (!amount || !stacksAddress) {
      setStep({
        status: 'error',
        amountIn: 0,
        amountOut: 0,
        fee: 0,
        error: 'Missing wallet information',
      });
      return;
    }

    setStep((prev) => ({ ...prev, status: 'pending' }));

    try {
      // Build swap transaction
      const txData = await buildSwapTransaction(
        parseFloat(amount),
        fromToken,
        toToken,
        stacksAddress
      );

      console.log('Swap transaction built:', txData);

      // For MVP: Show placeholder
      // In production: Sign and broadcast via Stacks wallet
      setStep({
        status: 'executing',
        amountIn: parseFloat(amount),
        amountOut: step.amountOut,
        fee: step.fee,
        txid: 'pending',
      });

      // Simulate transaction
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setStep({
        status: 'complete',
        amountIn: parseFloat(amount),
        amountOut: step.amountOut,
        fee: step.fee,
        txid: '0x' + Math.random().toString(16).slice(2),
      });
    } catch (error) {
      console.error('Swap error:', error);
      setStep({
        status: 'error',
        amountIn: parseFloat(amount),
        amountOut: 0,
        fee: 0,
        error: error instanceof Error ? error.message : 'Swap failed',
      });
    }
  };

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setAmount('');
  };

  if (!isConnected) {
    return <p className="text-gray-400">Connect wallet to swap</p>;
  }

  return (
    <div className="space-y-4">
      {/* From Token */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">From</label>
        <div className="flex gap-2">
          <select
            value={fromToken}
            onChange={(e) => {
              setFromToken(e.target.value as 'sBTC' | 'STX');
              setAmount('');
            }}
            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
          >
            <option value="sBTC">sBTC</option>
            <option value="STX">STX</option>
          </select>
          <input
            type="number"
            step="0.00000001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.01"
            disabled={step.status !== 'idle' && step.status !== 'quoting'}
            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 disabled:opacity-50"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Balance: {fromToken === 'sBTC' ? sbtcBalance.toFixed(6) : '0'} {fromToken}
        </p>
      </div>

      {/* Swap Button */}
      <div className="flex justify-center">
        <button
          onClick={handleSwapTokens}
          className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full text-gray-300"
        >
          ⇅
        </button>
      </div>

      {/* To Token */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">To</label>
        <div className="flex gap-2">
          <select
            value={toToken}
            onChange={(e) => {
              setToToken(e.target.value as 'sBTC' | 'STX');
              setAmount('');
            }}
            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
          >
            <option value="sBTC">sBTC</option>
            <option value="STX">STX</option>
          </select>
          <input
            type="number"
            value={step.amountOut.toFixed(8)}
            disabled
            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white disabled:opacity-50"
          />
        </div>
      </div>

      {/* Fee Info */}
      {amount && (
        <div className="p-3 bg-gray-700/50 rounded-lg text-sm text-gray-300">
          <div className="flex justify-between">
            <span>Fee (0.3%):</span>
            <span>{step.fee.toFixed(8)} {fromToken}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span>You receive:</span>
            <span className="text-green-400">{step.amountOut.toFixed(8)} {toToken}</span>
          </div>
        </div>
      )}

      {/* Swap Button */}
      {step.status === 'idle' || step.status === 'quoting' || step.status === 'error' ? (
        <button
          onClick={handleSwap}
          disabled={!amount || step.status === 'quoting'}
          className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 font-semibold"
        >
          {step.status === 'quoting' ? 'Getting quote...' : 'Swap'}
        </button>
      ) : null}

      {/* Status Messages */}
      {step.status === 'pending' && (
        <div className="p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg">
          <p className="text-sm text-yellow-300">Preparing swap...</p>
        </div>
      )}

      {step.status === 'executing' && (
        <div className="p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
          <p className="text-sm text-blue-300">Executing swap...</p>
          <p className="text-xs text-blue-400 mt-2">
            {step.amountIn.toFixed(8)} {fromToken} → {step.amountOut.toFixed(8)} {toToken}
          </p>
        </div>
      )}

      {step.status === 'complete' && (
        <div className="p-4 bg-green-900/30 border border-green-700 rounded-lg">
          <p className="text-sm text-green-300">✓ Swap complete!</p>
          <p className="text-xs text-green-400 mt-2">
            Received {step.amountOut.toFixed(8)} {toToken}
          </p>
          {step.txid && (
            <p className="text-xs text-green-400 mt-1 break-all">TXID: {step.txid}</p>
          )}
        </div>
      )}

      {step.status === 'error' && (
        <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg">
          <p className="text-sm text-red-300">{step.error}</p>
          <button
            onClick={() => {
              setStep({ status: 'idle', amountIn: 0, amountOut: 0, fee: 0 });
              setAmount('');
            }}
            className="mt-2 text-xs text-red-400 hover:text-red-300 underline"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
