'use client';

import { useState } from 'react';
import LayoutShell from '@/components/LayoutShell';
import { useStore } from '@/store/useStore';

const Logos = {
  ALEX: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
  ),
  Zest: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
  ),
  BitFlow: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4A9EFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M6 12h12"/></svg>
  ),
  Granite: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8A94A8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
  ),
};

const protocols = [
  { name: 'ALEX', type: 'DEX / Swap', tag: 'blue', apy: '—', tvl: '$24.5M', position: 'No position', action: 'Swap →', logo: Logos.ALEX },
  { name: 'Zest', type: 'Lending', tag: 'purple', apy: '6.2% APY', tvl: '$8.3M', position: 'No position', action: 'Deposit →', logo: Logos.Zest },
  { name: 'BitFlow', type: 'Liquidity', tag: 'blue', apy: '12.4% APY', tvl: '$4.1M', position: 'No position', action: 'Add Liquidity →', logo: Logos.BitFlow },
  { name: 'Granite', type: 'Money Market', tag: 'gray', apy: '4.8% APY', tvl: '$2.7M', position: 'No position', action: 'Supply →', logo: Logos.Granite },
];

export default function DeFiPage() {
  const { balances, addTransaction, isConnected } = useStore();
  const [activeTab, setActiveTab] = useState('All');
  const [selectedProtocol, setSelectedProtocol] = useState<any>(null);
  const [depositAmount, setDepositAmount] = useState('');

  const tags: Record<string, string> = {
    blue: 'text-[#4A9EFF] border-[#4A9EFF]/30 bg-[#4A9EFF]/10',
    purple: 'text-[#A855F7] border-[#A855F7]/30 bg-[#A855F7]/10',
    gray: 'text-[#8A94A8] border-[#8A94A8]/30 bg-[#8A94A8]/10',
  };

  const handleConfirmDeposit = () => {
    if (!selectedProtocol || !depositAmount) return;
    
    addTransaction({
      type: 'Yield',
      amount: `${depositAmount} sBTC`,
      txId: `SP${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
      chain: 'Stacks',
      details: `Deposited into ${selectedProtocol.name} for yield`
    });
    
    setSelectedProtocol(null);
    setDepositAmount('');
  };

  return (
    <LayoutShell>
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-white/5 pb-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-display font-black text-white italic tracking-tighter uppercase">DeFi</h2>
          <p className="text-[11px] font-mono text-[#4A5168] uppercase tracking-widest">Bitcoin-native yield and liquidity on Stacks</p>
        </div>
        <div>
          <span className="text-[10px] font-mono text-[#4A5168] mr-3 uppercase tracking-[0.2em] font-black">TOTAL DEPLOYED:</span>
          <span className="text-[20px] font-mono text-white font-black tracking-tighter italic">0.00 sBTC</span>
        </div>
      </div>

      {/* Protocol Tabs */}
      <div className="flex gap-12 mb-12 border-b border-white/5 relative">
        {['All', 'Lending', 'Liquidity', 'Yield'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-[12px] font-black uppercase tracking-[0.2em] transition-all relative ${
              activeTab === tab ? 'text-white' : 'text-[#4A5168] hover:text-[#8A94A8]'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#F7931A]"></div>
            )}
          </button>
        ))}
      </div>

      <div className="flex relative">
        {/* Protocol Table */}
        <div className={`flex-1 transition-all duration-300 ${selectedProtocol ? 'mr-[450px]' : ''}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-white/5">
                  <th className="pb-6 text-[10px] font-mono text-[#4A5168] uppercase tracking-[0.3em] font-black">PROTOCOL</th>
                  <th className="pb-6 text-[10px] font-mono text-[#4A5168] uppercase tracking-[0.3em] font-black">TYPE</th>
                  <th className="pb-6 text-[10px] font-mono text-[#4A5168] uppercase tracking-[0.3em] font-black">APY</th>
                  <th className="pb-6 text-[10px] font-mono text-[#4A5168] uppercase tracking-[0.3em] font-black">TVL</th>
                  <th className="pb-6 text-[10px] font-mono text-[#4A5168] uppercase tracking-[0.3em] font-black">YOUR POSITION</th>
                  <th className="pb-6 text-[10px] font-mono text-[#4A5168] uppercase tracking-[0.3em] font-black text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="text-[13px]">
                {protocols.map((p, idx) => (
                  <tr 
                    key={idx} 
                    className="cursor-pointer group hover:bg-white/[0.02] transition-all border-b border-white/5 last:border-0"
                    onClick={() => setSelectedProtocol(p)}
                  >
                    <td className="py-8">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#161A22] rounded-[4px] flex items-center justify-center border border-white/5 group-hover:border-[#F7931A]/30 transition-all font-black selection:bg-[#F7931A] selection:text-[#0D0F14]">
                          <p.logo />
                        </div>
                        <span className="font-black text-white uppercase tracking-tight text-base mb-0.5">{p.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`px-3 py-1 rounded-[2px] text-[10px] font-mono border font-black uppercase tracking-widest ${tags[p.tag]}`}>
                        {p.type}
                      </span>
                    </td>
                    <td>
                      <span className={`${p.apy !== '—' ? 'text-[#22C55E] font-black' : 'text-[#4A5168] font-mono'}`}>
                        {p.apy}
                      </span>
                    </td>
                    <td className="text-[#8A94A8] font-mono tracking-tighter font-bold uppercase">{p.tvl}</td>
                    <td className="text-[#4A5168] font-mono uppercase tracking-widest italic">{p.position}</td>
                    <td className="text-right">
                      <button className={`text-[11px] font-black uppercase tracking-widest transition-all px-4 py-2 rounded-[4px] border border-transparent group-hover:border-current ${
                        p.action.includes('Swap') ? 'text-[#4A9EFF]' : 
                        p.action.includes('Deposit') ? 'text-[#F7931A]' : 'text-[#8A94A8]'
                      }`}>
                        {p.action}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Active Positions Empty State */}
          <div className="mt-24">
            <h3 className="text-[10px] font-mono text-[#F7931A] uppercase tracking-[0.4em] font-black mb-12">
              // YOUR ACTIVE POSITIONS
            </h3>
            <div className="py-24 text-center border border-white/5 bg-[#161A22]/20 rounded-[4px] relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
              <p className="text-[16px] font-black text-white mb-3 uppercase tracking-widest italic">
                No active yield positions detected
              </p>
              <p className="text-[11px] font-mono text-[#4A5168] uppercase tracking-[0.2em] group-hover:text-[#8A94A8] transition-colors">Select a protocol from the manifest above to deploy capital</p>
            </div>
          </div>
        </div>

        {/* Right Drawer */}
        {selectedProtocol && (
          <div className="fixed top-0 right-0 h-full w-[450px] bg-[#161A22] border-l border-white/10 shadow-[-20px_0_50px_rgba(0,0,0,0.8)] z-[60] animate-in slide-in-from-right duration-500">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#F7931A]/20"></div>
            <div className="p-12 h-full flex flex-col relative">
              <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-[#0D0F14] rounded-[4px] border border-white/10 flex items-center justify-center shadow-xl">
                    <selectedProtocol.logo />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black font-display text-white uppercase italic tracking-tighter">{selectedProtocol.name} Manifest</h3>
                    <span className={`text-[9px] font-mono border px-2 py-0.5 mt-2 inline-block rounded-[2px] font-black uppercase tracking-widest ${tags[selectedProtocol.tag]}`}>
                      {selectedProtocol.type.toUpperCase()}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedProtocol(null)}
                  className="w-10 h-10 flex items-center justify-center rounded-[4px] bg-white/5 border border-white/5 hover:bg-white/10 text-white transition-all group"
                >
                  <span className="group-hover:rotate-90 transition-transform duration-300">✕</span>
                </button>
              </div>

              <div className="space-y-12 flex-1 overflow-y-auto pr-4 custom-scrollbar">
                <div className="space-y-6">
                  <p className="text-[14px] text-[#8A94A8] font-body leading-relaxed selection:bg-[#F7931A] selection:text-[#0D0F14]">
                    {selectedProtocol.name} infrastructure facilitates institutional-grade {selectedProtocol.type.toLowerCase()} for the Bitcoin economy. Secured by Stacks and the Bitcoin network.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 border-y border-white/5 py-8">
                    <div className="bg-[#0D0F14]/50 p-4 rounded-[4px] border border-white/5">
                      <div className="text-[9px] font-mono text-[#4A5168] mb-1 uppercase tracking-widest">Protocol TVL</div>
                      <div className="text-[18px] font-black text-white italic tracking-tighter uppercase">{selectedProtocol.tvl}</div>
                    </div>
                    <div className="bg-[#0D0F14]/50 p-4 rounded-[4px] border border-white/5">
                      <div className="text-[9px] font-mono text-[#4A5168] mb-1 uppercase tracking-widest">Target APY</div>
                      <div className="text-[18px] font-black text-[#22C55E] italic tracking-tighter uppercase">{selectedProtocol.apy}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0D0F14] p-8 rounded-[4px] border border-white/10 space-y-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#F7931A]/5 blur-3xl rounded-full"></div>
                  <h4 className="text-[10px] font-mono text-[#F7931A] uppercase tracking-[0.3em] font-black">// DECODE TRANSACTION</h4>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-mono px-1 uppercase tracking-widest font-black">
                      <span className="text-[#4A5168]">Deposit Amount</span>
                      <button 
                        className="text-[#F7931A] hover:underline"
                        onClick={() => setDepositAmount(balances.sBTC)}
                      >
                        MAX: {balances.sBTC} sBTC
                      </button>
                    </div>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        placeholder="0.00000000"
                        className="w-full h-16 bg-[#161A22] border border-white/10 rounded-[4px] px-6 font-display font-black text-2xl text-white focus:border-[#F7931A]/40 outline-none transition-all placeholder:text-[#1C2130]"
                      />
                      <span className="absolute right-6 top-1/2 -translate-y-1/2 font-mono text-xs font-black text-[#4A5168] tracking-widest">sBTC</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleConfirmDeposit}
                    disabled={!isConnected || !depositAmount || parseFloat(depositAmount) <= 0}
                    className="w-full h-20 bg-[#F7931A] text-[#0D0F14] font-black text-lg uppercase tracking-[0.2em] rounded-[4px] hover:bg-[#F7931A]/90 transition-all disabled:opacity-20 disabled:cursor-not-allowed group relative overflow-hidden"
                  >
                    Authorize Deposit <span className="ml-4 group-hover:translate-x-2 transition-transform inline-block">→</span>
                  </button>
                  {!isConnected && <p className="text-center text-[9px] font-mono text-[#EF4444] uppercase tracking-widest italic font-black">Link wallet to deploy assets</p>}
                </div>

                <div className="space-y-4">
                  <h5 className="text-[9px] font-mono text-[#4A5168] uppercase tracking-widest font-black">// PROTOCOL INSIGHTS</h5>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { label: 'Risk Profile', value: 'Btc-Native / Smart Contract' },
                      { label: 'Lock Period', value: 'Liquid / No Lock' },
                      { label: 'Yield Source', value: 'Market Neutral / Lending Fee' },
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center text-[10px] font-mono border-l border-white/5 pl-4 py-1">
                        <span className="text-[#4A5168] uppercase tracking-widest">{item.label}</span>
                        <span className="text-white font-black uppercase tracking-tight">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-white/5 text-center">
                <button className="text-[10px] font-mono text-[#4A5168] hover:text-[#4A9EFF] uppercase tracking-[0.3em] font-black transition-colors">
                  Read Technical Docs ↗
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </LayoutShell>
  );
}
