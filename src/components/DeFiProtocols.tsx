'use client';

import { useState } from 'react';
import { useWalletStore } from '@/lib/store';

export default function DeFiProtocols() {
  const { sbtcBalance } = useWalletStore();
  const [loading, setLoading] = useState<string | null>(null);

  const protocols = [
    {
      id: 'zest',
      name: 'Zest Protocol',
      description: 'Bitcoin Lending & Borrowing',
      apy: '4.8% APY',
      icon: '🏦',
      action: 'Lend sBTC',
      color: 'blue'
    },
    {
      id: 'bitflow',
      name: 'BitFlow',
      description: 'Liquidity & DEX for Bitcoin',
      apy: '12.5% APY',
      icon: '🌊',
      action: 'Add Liquidity',
      color: 'teal'
    }
  ];

  const handleAction = (id: string) => {
    setLoading(id);
    setTimeout(() => {
      setLoading(null);
      alert(`${id === 'zest' ? 'Lent' : 'Added liquidity'} successfully! (Simulation)`);
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg mb-6">
        <p className="text-blue-400 text-sm">
          <strong>Tip:</strong> Earn yield on your sBTC by participating in these Stacks DeFi protocols.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {protocols.map((protocol) => (
          <div 
            key={protocol.id}
            className="bg-gray-800 border border-gray-700 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-gray-600 transition-all group"
          >
            <div className="flex items-center gap-6">
              <div className="text-4xl group-hover:scale-110 transition-transform">{protocol.icon}</div>
              <div>
                <h3 className="text-xl font-bold text-white">{protocol.name}</h3>
                <p className="text-gray-400 text-sm">{protocol.description}</p>
                <div className="flex gap-4 mt-2">
                  <span className="text-green-400 text-xs font-bold bg-green-400/10 px-2 py-1 rounded">
                    {protocol.apy}
                  </span>
                  <span className="text-gray-500 text-xs">
                    TVL: $45.2M
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2 w-full md:w-auto">
              <button
                onClick={() => handleAction(protocol.id)}
                disabled={loading !== null || sbtcBalance <= 0}
                className={`w-full md:w-48 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all disabled:opacity-50`}
              >
                {loading === protocol.id ? 'Processing...' : protocol.action}
              </button>
              {sbtcBalance <= 0 && (
                <p className="text-[10px] text-red-400">Needs sBTC balance</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
