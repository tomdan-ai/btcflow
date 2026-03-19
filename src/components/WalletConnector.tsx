'use client';

import { useEffect, useState } from 'react';
import { useWalletStore } from '@/lib/store';
import { getBtcBalance } from '@/lib/bitcoin';
import { getAddressFromPublicKey } from '@stacks/transactions';
import type { BitcoinProvider } from '@/types/bitcoin';
import { turnkeyService } from '@/lib/turnkey';

export default function WalletConnector() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { btcAddress, isConnected, setWallet, disconnect, setStacksAddress } = useWalletStore();

  const connectWallet = async () => {
    setLoading(true);
    setError(null);

    try {
      if (window.unisat) {
        console.log('Connecting with UniSat...');
        const provider = window.unisat as BitcoinProvider;
        const accounts = await provider.requestAccounts();
        const address = accounts[0];
        const publicKey = await provider.getPublicKey();
        const network = await provider.getNetwork();
        const balance = await getBtcBalance(address, network);
        const stxAddress = getAddressFromPublicKey(publicKey, 'testnet');
        
        setWallet(address, publicKey, balance, network);
        setStacksAddress(stxAddress);
        return;
      }
      throw new Error('UniSat wallet not found');
    } catch (err) {
      console.error('UniSat connection error:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect UniSat');
    } finally {
      setLoading(false);
    }
  };

  const handleTurnKeyLogin = async (isSignup: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const result = isSignup 
        ? await turnkeyService.createPasskey("demo-user-" + Math.floor(Math.random() * 1000))
        : await turnkeyService.login();
        
      const mockPublicKey = "02647711598144da605f15d2a93910c26685121ca8d0e74f4b237ec7102e3427f3";
      const mockBtcAddress = isSignup ? "tb1q_turnkey_" + Math.random().toString(36).slice(2, 7) : "tb1q_logged_in_passkey";
      
      const stxAddress = getAddressFromPublicKey(mockPublicKey, 'testnet');
      setWallet(mockBtcAddress, mockPublicKey, 0, 'testnet4');
      setStacksAddress(stxAddress);
      
      console.log('TurnKey session established:', result);
    } catch (error) {
      console.error('TurnKey login error:', error);
      setError('Passkey operation failed or cancelled');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  if (isConnected) {
    return (
      <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg border border-gray-700">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 uppercase font-bold">Connected</span>
          <span className="text-sm text-gray-300 font-mono">
            {btcAddress?.slice(0, 10)}...{btcAddress?.slice(-8)}
          </span>
        </div>
        <button
          onClick={handleDisconnect}
          className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-500 px-3 py-1.5 rounded transition-colors border border-red-500/20"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button
        onClick={connectWallet}
        disabled={loading}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(249,115,22,0.3)] disabled:opacity-50"
      >
        <span className="text-xl group-hover:scale-110 transition-transform">₿</span>
        {loading ? 'Connecting...' : 'Connect UniSat'}
      </button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-700"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-gray-900 px-2 text-gray-500 font-medium">Or Use Secure Passkey</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => handleTurnKeyLogin(true)}
          disabled={loading}
          className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-2 px-4 rounded-lg border border-gray-700 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
        >
          <span>🔑</span> Signup
        </button>
        <button
          onClick={() => handleTurnKeyLogin(false)}
          disabled={loading}
          className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-2 px-4 rounded-lg border border-gray-700 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
        >
          <span>👤</span> Login
        </button>
      </div>
      
      {error && <p className="text-red-400 text-xs text-center">{error}</p>}
    </div>
  );
}
