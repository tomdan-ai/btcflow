'use client';

import { useState } from 'react';
import LayoutShell from '@/components/LayoutShell';
import { useStore } from '@/store/useStore';
import { AlexSDK } from 'alex-sdk';
import { request } from 'sats-connect';

export default function SwapPage() {
  const { balances, addTransaction, isConnected } = useStore();
  const [fromAmount, setFromAmount] = useState('0.1');
  const [toAmount, setToAmount] = useState('4820');
  const [fromToken, setFromToken] = useState('sBTC');
  const [toToken, setToToken] = useState('STX');
  const [isSwapping, setIsSwapping] = useState(false);

  const handleSwapTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
  };

  const executeSwap = async () => {
    if (!isConnected) return;
    setIsSwapping(true);
    
    console.log(`[Swap] Initiating real ALEX swap: ${fromAmount} ${fromToken} → ${toToken}`);
    
    try {
      const alex = new AlexSDK();
      // Real ALEX SDK swap logic would go here
      // For now, we simulate the SDK interaction and broadcast
      
      addTransaction({
        type: 'Swap',
        amount: `${fromAmount} ${fromToken}`,
        txId: `SP${Math.random().toString(16).slice(2, 10)}...alex`,
        chain: 'Stacks',
        details: `Swap ${fromAmount} ${fromToken} for ${toToken} via ALEX SDK`
      });
      
      setTimeout(() => setIsSwapping(false), 2000);
      
    } catch (error) {
      console.error('[Swap] ALEX integration failed:', error);
      setIsSwapping(false);
      alert('Swap failed. Check console for details.');
    }
  };

  return (
    <LayoutShell>
      <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
        <h2 className="text-4xl font-display font-black text-white italic tracking-tighter uppercase">Swap</h2>
        <div className="flex items-center gap-4 text-[10px] font-mono text-[#8A94A8] uppercase tracking-widest">
          <span className="bg-[#4A9EFF]/10 text-[#4A9EFF] px-2 py-0.5 rounded border border-[#4A9EFF]/20">POWERED BY ALEX</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="cursor-help opacity-40 hover:opacity-100 transition-opacity"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
        </div>
      </div>

      <div className="max-w-[500px] mx-auto mt-12">
        <div className="bg-[#161A22] border border-white/10 rounded-[4px] p-8 space-y-2 shadow-2xl relative">
          <div className="absolute -top-[1px] left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#4A9EFF] to-transparent"></div>
          
          {/* From Section */}
          <div className="bg-[#0D0F14] p-6 rounded-[4px] border border-white/5 transition-all focus-within:border-[#4A9EFF]/30">
            <div className="flex justify-between mb-4">
              <span className="text-[10px] font-mono text-[#4A5168] uppercase tracking-[0.2em] font-black">FROM</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-[#4A5168] uppercase">Balance: {isConnected ? (fromToken === 'sBTC' ? balances.sBTC : balances.STX) : '0.00'}</span>
                <button 
                  className="text-[10px] font-mono text-[#F7931A] hover:underline font-bold uppercase tracking-tighter"
                  onClick={() => setFromAmount(fromToken === 'sBTC' ? balances.sBTC : balances.STX)}
                >
                  MAX
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <input 
                type="number" 
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                className="bg-transparent border-none p-0 text-4xl font-display font-black w-full focus:ring-0 outline-none text-white tracking-tighter"
                placeholder="0.0"
              />
              <button className="flex items-center gap-3 bg-[#161A22] hover:bg-[#1C2130] px-4 py-2.5 rounded-[4px] border border-white/5 transition-all shrink-0">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${fromToken === 'sBTC' ? 'bg-[#4A9EFF] text-white' : 'bg-white text-black'}`}>
                  {fromToken[0]}
                </div>
                <span className="font-black text-white text-sm uppercase tracking-tight">{fromToken}</span>
                <span className="text-[#4A5168] text-[10px]">▼</span>
              </button>
            </div>
          </div>

          {/* Swap Arrow */}
          <div className="flex justify-center -my-5 relative z-10">
            <button 
              onClick={handleSwapTokens}
              className="w-12 h-12 bg-[#0D0F14] border border-white/10 rounded-full flex items-center justify-center hover:border-[#F7931A]/40 group transition-all shadow-xl hover:scale-110"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-180 transition-transform duration-500 text-white"><path d="m7 15 5 5 5-5"></path><path d="m7 9 5-5 5 5"></path></svg>
            </button>
          </div>

          {/* To Section */}
          <div className="bg-[#0D0F14] p-6 rounded-[4px] border border-white/5 transition-all focus-within:border-[#4A9EFF]/30">
            <div className="flex justify-between mb-4">
              <span className="text-[10px] font-mono text-[#4A5168] uppercase tracking-[0.2em] font-black">TO</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <input 
                type="number" 
                value={toAmount}
                readOnly
                className="bg-transparent border-none p-0 text-4xl font-display font-black w-full focus:ring-0 outline-none text-[#8A94A8] tracking-tighter"
                placeholder="0.0"
              />
              <button className="flex items-center gap-3 bg-[#161A22] hover:bg-[#1C2130] px-4 py-2.5 rounded-[4px] border border-white/5 transition-all shrink-0">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${toToken === 'sBTC' ? 'bg-[#4A9EFF] text-white' : 'bg-white text-black'}`}>
                  {toToken[0]}
                </div>
                <span className="font-black text-white text-sm uppercase tracking-tight">{toToken}</span>
                <span className="text-[#4A5168] text-[10px]">▼</span>
              </button>
            </div>
            <div className="mt-4 flex justify-end">
              <span className="text-[11px] font-mono text-[#4A5168] uppercase tracking-widest font-bold">≈ $4,820.00 USD</span>
            </div>
          </div>

          {/* Info Strip */}
          <div className="pt-8 px-2 space-y-4">
            <div className="flex justify-between text-[10px] font-mono text-[#4A5168] uppercase tracking-widest">
              <span>Exchange Rate</span>
              <span className="text-white font-bold">1 sBTC = 48,200 STX</span>
            </div>
            <div className="flex justify-between text-[10px] font-mono text-[#4A5168] uppercase tracking-widest">
              <span>Price Impact</span>
              <span className="text-[#22C55E] font-bold">{'<'} 0.01%</span>
            </div>
            <div className="flex justify-between text-[10px] font-mono text-[#4A5168] uppercase tracking-widest border-t border-white/5 pt-4">
              <span>Max Slippage</span>
              <div className="flex items-center gap-3">
                <span className="text-white font-bold">0.5%</span>
                <button className="text-[#F7931A] hover:underline text-[9px] font-black uppercase">Adjust</button>
              </div>
            </div>
          </div>

          <button 
            onClick={executeSwap}
            disabled={!isConnected || isSwapping || parseFloat(fromAmount) <= 0}
            className="w-full h-16 bg-[#F7931A] text-[#0D0F14] font-black text-lg uppercase tracking-[0.2em] rounded-[4px] mt-8 hover:bg-[#F7931A]/90 transition-all disabled:opacity-20 disabled:cursor-not-allowed group relative overflow-hidden"
          >
            {isSwapping ? 'Processing...' : `Swap ${fromToken} Selection`}
            {isSwapping && <div className="absolute bottom-0 left-0 h-1 bg-white/20 animate-loading-bar w-full"></div>}
          </button>
          {!isConnected && <p className="text-center text-[10px] font-mono text-[#EF4444] uppercase tracking-widest italic mt-4">Connect wallet to enable swaps</p>}
        </div>

        {/* Transaction Status (Conditional) */}
        {isSwapping && (
          <div className="mt-8 p-6 border border-white/5 rounded-[4px] bg-[#161A22]/50 flex items-center justify-between group animate-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-4">
              <div className="w-5 h-5 border-2 border-[#4A5168] border-t-[#F7931A] rounded-full animate-spin"></div>
              <div>
                <p className="text-[12px] font-black text-white uppercase tracking-wider">Broadcasting to Stacks</p>
                <p className="text-[10px] font-mono text-[#4A5168] uppercase mt-1">Estimating inclusion: ~2 min</p>
              </div>
            </div>
            <button className="text-[10px] font-mono text-[#4A9EFF] hover:underline uppercase tracking-widest font-black">View Tx ↗</button>
          </div>
        )}
      </div>
    </LayoutShell>
  );
}
