'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useStore } from '@/store/useStore';

export default function TopBar() {
  const pathname = usePathname();
  const { network, setNetwork } = useStore();
  const [showNetworkMenu, setShowNetworkMenu] = useState(false);

  const getPageTitle = (path: string) => {
    const segment = path.split('/').filter(Boolean)[0];
    if (!segment || segment === 'dashboard') return 'Overview';
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  return (
    <header className="h-[56px] border-b border-[rgba(255,255,255,0.07)] flex items-center justify-between px-8 bg-[#0D0F14]/80 backdrop-blur-md sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <h1 className="text-[14px] font-mono font-bold text-white uppercase tracking-widest">
          {getPageTitle(pathname)}
        </h1>
        <div className="h-4 w-px bg-white/10 hidden md:block"></div>
        <div className="relative hidden md:block">
          <button 
            onClick={() => setShowNetworkMenu(!showNetworkMenu)}
            className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded border border-white/5 hover:border-white/10 transition-all group"
          >
            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${network === 'MAINNET' ? 'bg-[#22C55E]' : 'bg-[#F7931A]'}`}></div>
            <span className="text-[10px] font-mono text-[#8A94A8] group-hover:text-white transition-colors uppercase">{network}</span>
            <span className="text-[8px] text-[#4A5168]">▼</span>
          </button>

          {showNetworkMenu && (
            <div className="absolute top-full left-0 mt-2 w-32 bg-[#161A22] border border-white/10 rounded-lg shadow-2xl z-50 py-1 animate-in fade-in zoom-in-95 duration-200">
              {(['TESTNET4', 'TESTNET3', 'MAINNET', 'DEVNET'] as const).map((net) => (
                <button
                  key={net}
                  onClick={() => {
                    console.log(`[TopBar] Requesting network switch to: ${net}`);
                    setNetwork(net);
                    setShowNetworkMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-[10px] font-mono hover:bg-white/5 transition-colors uppercase tracking-wider ${network === net ? 'text-[#F7931A]' : 'text-[#8A94A8]'}`}
                >
                  {net}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 hover:bg-white/5 rounded-lg transition-colors group" title="Refresh">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4A5168" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-white transition-colors"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path><polyline points="23 4 23 10 17 10"></polyline></svg>
        </button>
        <button className="p-2 hover:bg-white/5 rounded-lg transition-colors group" title="Settings">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4A5168" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-white transition-colors"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
        </button>
      </div>
    </header>
  );
}
