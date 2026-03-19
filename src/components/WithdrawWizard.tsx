'use client';

import { useState } from 'react';
import { useWalletStore } from '@/lib/store';
import { withdrawSbtc } from '@/lib/deposit';

interface WithdrawWizardProps {
  onClose: () => void;
}

export default function WithdrawWizard({ onClose }: WithdrawWizardProps) {
  const { btcAddress, sbtcBalance, stacksAddress } = useWalletStore();
  const [amount, setAmount] = useState('');
  const [destination, setDestination] = useState(btcAddress || '');
  const [step, setStep] = useState<'input' | 'confirming' | 'complete'>('input');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txid, setTxid] = useState<string | null>(null);

  const handleWithdraw = async () => {
    if (!amount || isNaN(parseFloat(amount))) {
      setError('Please enter a valid amount');
      return;
    }

    if (parseFloat(amount) > sbtcBalance) {
      setError('Insufficient sBTC balance');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await withdrawSbtc(parseFloat(amount), destination, stacksAddress!);
      if (result.status === 'success' || result.txid) {
        setTxid(result.txid || '0x_mock_withdrawal_txid');
        setStep('confirming');
        
        // Add to history
        useWalletStore.getState().addTransaction({
          id: Math.random().toString(36).substring(7),
          type: 'withdraw',
          amount: parseFloat(amount),
          fromToken: 'sBTC',
          toToken: 'BTC',
          status: 'pending',
          timestamp: new Date().toISOString(),
          txid: result.txid || 'pending_peg_out',
        });
      } else {
        throw new Error('Withdrawal failed');
      }
    } catch (err) {
      console.error('Withdrawal error:', err);
      setError(err instanceof Error ? err.message : 'Failed to initiate withdrawal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-2xl max-w-md w-full animate-in fade-in zoom-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Withdraw sBTC</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
      </div>

      {step === 'input' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Amount (sBTC)</label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg py-3 px-4 text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              />
              <button 
                onClick={() => setAmount(sbtcBalance.toString())}
                className="absolute right-3 top-2.5 text-xs text-orange-500 hover:text-orange-400 font-bold"
              >
                MAX
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Available: {sbtcBalance} sBTC</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Destination BTC Address</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg py-3 px-4 text-white font-mono text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
            />
          </div>

          {error && <p className="text-red-400 text-sm py-2 px-3 bg-red-400/10 rounded border border-red-400/20">{error}</p>}

          <button
            onClick={handleWithdraw}
            disabled={loading || !amount}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-lg transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Withdraw to Bitcoin'}
          </button>
        </div>
      )}

      {step === 'confirming' && (
        <div className="text-center py-8 space-y-4">
          <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h3 className="text-lg font-bold text-white">Withdrawal Initiated</h3>
          <p className="text-gray-400 text-sm">
            Your withdrawal of <span className="text-white font-semibold">{amount} sBTC</span> is being processed. 
            Once confirmed by the peg-in controllers, you will receive BTC at your address.
          </p>
          {txid && (
            <div className="bg-gray-900 p-3 rounded text-xs break-all font-mono text-gray-500 mt-4">
              Peg-out ID: {txid}
            </div>
          )}
          <button
            onClick={onClose}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg mt-6"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}
