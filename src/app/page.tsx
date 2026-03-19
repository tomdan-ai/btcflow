'use client';

import WalletConnector from '@/components/WalletConnector';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <header className="bg-black/50 backdrop-blur border-b border-orange-500/20">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white">
            <span className="text-orange-500">BTC</span>Flow
          </h1>
          <p className="text-gray-400 text-sm mt-1">Bitcoin-Native UX Layer for sBTC DeFi</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-8 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Connect Your Wallet</h2>
          <WalletConnector />
        </div>

        <Dashboard />
      </main>
    </div>
  );
}
