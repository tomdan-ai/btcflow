'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useStore } from '@/store/useStore';

const Icons = {
  Dashboard: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
  ),
  Deposit: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M19 12l-7 7-7-7"></path></svg>
  ),
  Withdraw: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7"></path></svg>
  ),
  Swap: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7 15 5 5 5-5"></path><path d="m7 9 5-5 5 5"></path></svg>
  ),
  DeFi: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
  ),
  History: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
  ),
};

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: Icons.Dashboard },
  { label: 'Deposit', href: '/deposit', icon: Icons.Deposit },
  { label: 'Withdraw', href: '/withdraw', icon: Icons.Withdraw },
  { label: 'Swap', href: '/swap', icon: Icons.Swap },
  { label: 'DeFi', href: '/defi', icon: Icons.DeFi },
  { label: 'History', href: '/history', icon: Icons.History },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isConnected, address, network, setNetwork, disconnect, walletProvider } = useStore();
  const [showNetworkMenu, setShowNetworkMenu] = useState(false);

  return (
    <aside className="w-16 xl:w-[240px] fixed h-full bg-[#161A22] border-r border-[rgba(255,255,255,0.07)] flex flex-col z-50 transition-all duration-300">
      <div className="p-4 xl:p-5 overflow-visible relative">
        <Link href="/" className="flex items-center gap-2 mb-2 whitespace-nowrap group">
          <img 
            src="/btcflow_logo.png" 
            alt="BTCFlow Logo" 
            className="w-8 h-8 xl:w-10 xl:h-10 object-contain transition-transform group-hover:scale-105" 
          />
          <span className="text-white font-bold text-lg font-display hidden xl:inline group-hover:text-[#F7931A] transition-colors uppercase tracking-tighter">BTCFlow</span>
        </Link>
        
        <div className="relative">
          <button 
            onClick={() => setShowNetworkMenu(!showNetworkMenu)}
            className="flex items-center gap-2 xl:opacity-100 opacity-0 xl:visible invisible overflow-hidden transition-all hover:bg-white/5 px-2 py-1 -ml-2 rounded"
          >
            <div className={`w-2 h-2 rounded-full animate-pulse ${network === 'MAINNET' ? 'bg-[#22C55E]' : 'bg-[#F7931A]'}`}></div>
            <span className="text-[10px] font-mono text-[#4A5168] uppercase tracking-wider">{network}</span>
            <span className="text-[8px] text-[#4A5168]">▼</span>
          </button>

          {showNetworkMenu && (
            <div className="absolute top-full left-0 mt-2 w-32 bg-[#1C2130] border border-white/10 rounded-lg shadow-2xl z-[70] py-1 animate-in fade-in zoom-in-95 duration-200">
              {(['TESTNET4', 'TESTNET3', 'MAINNET', 'DEVNET'] as const).map((net) => (
                <button
                  key={net}
                  onClick={() => {
                    console.log(`[Sidebar] Requesting network switch to: ${net}`);
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

      <nav className="flex-1 mt-6 overflow-x-hidden">
        <p className="px-5 text-[9px] font-mono text-[#4A5168] uppercase tracking-[0.2em] mb-4 hidden xl:block whitespace-nowrap">// NAVIGATE</p>
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  title={item.label}
                  className={`flex items-center gap-3 px-5 py-3 transition-all relative ${
                    isActive
                      ? 'bg-[rgba(247,147,26,0.08)] border-l-[3px] border-[#F7931A] text-white'
                      : 'text-[#8A94A8] hover:bg-[rgba(255,255,255,0.04)] hover:text-white'
                  }`}
                >
                  <span className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                    <Icon />
                  </span>
                  <span className={`text-[14px] whitespace-nowrap transition-opacity duration-300 hidden xl:inline ${isActive ? 'font-semibold' : ''}`}>
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 xl:p-5 border-t border-[rgba(255,255,255,0.07)] overflow-hidden">
        {isConnected ? (
          <>
            <div className="flex items-center justify-between mb-2">
              <div className="flex flex-col gap-1 hidden xl:flex">
                <span className="text-[11px] font-mono text-[#F0F2F7]">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
                <span className="text-[9px] font-mono text-[#4A5168] uppercase tracking-wider">CONNECTED ({walletProvider})</span>
              </div>
              <div className="w-[6px] h-[6px] rounded-full bg-[#22C55E]"></div>
            </div>
            <button 
              onClick={disconnect}
              className="text-[11px] font-mono text-[#EF4444]/60 hover:text-[#EF4444] transition-colors xl:block hidden mt-2"
            >
              Disconnect Wallet
            </button>
          </>
        ) : (
          <Link 
            href="/connect"
            className="flex items-center gap-2 text-[11px] font-mono text-[#F7931A] hover:underline uppercase transition-all xl:opacity-100 opacity-0 xl:visible invisible"
          >
            Connect Wallet →
          </Link>
        )}
      </div>
    </aside>
  );
}
