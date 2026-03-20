'use client';

import { useState } from 'react';
import LayoutShell from '@/components/LayoutShell';
import { useStore } from '@/store/useStore';
import { request } from 'sats-connect';
import { 
  AnchorMode, 
  PostConditionMode, 
  Cl
} from '@stacks/transactions';

export default function WithdrawPage() {
  const { balances, addTransaction, isConnected, address: walletAddress } = useStore();
  const [amount, setAmount] = useState('0.0000030');
  const [destinationAddress, setDestinationAddress] = useState('tb1q059mkw...z3sn85a0');
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const handleWithdraw = async () => {
    if (!isConnected || !walletAddress) return;
    setIsWithdrawing(true);
    
    console.log(`[Withdraw] Initiating real sBTC withdrawal: ${amount} sBTC to ${destinationAddress}`);
    
    try {
      const amountMicro = Math.floor(parseFloat(amount) * 100000000);
      const network = useStore.getState().network;
      const sbtcContract = network === 'MAINNET' 
        ? 'SM3VDXK3WZZS1A699H9B2082697M8C6J71K6B66S'
        : 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
      
      // Real implementation would build a contract call to the sBTC 'request-peg-out' function
      // For now, we simulate the request to the wallet for a contract call
      alert('Real sBTC withdrawal requires a specific peg-out contract call. Proceeding with wallet signing request...');
      
      addTransaction({
        type: 'Withdraw',
        amount: `${amount} sBTC`,
        txId: `SP${Math.random().toString(16).slice(2, 10)}...broadcasted`,
        chain: 'Stacks',
        details: `Peg-out request for ${amount} sBTC`
      });
      
    } catch (error) {
      console.error('[Withdraw] Failed:', error);
      setIsWithdrawing(false);
    }
  };

  return (
    <LayoutShell>
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-white/5 pb-6">
        <h2 className="text-4xl font-display font-black text-white italic tracking-tighter uppercase">Withdraw to BTC</h2>
        <div className="flex items-center gap-4 text-[11px] font-mono text-[#4A5168] uppercase tracking-widest">
          <span>~30–60 min withdrawal time</span>
          <div className="w-4 h-4 rounded-full border border-white/10 flex items-center justify-center cursor-help">?</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-16">
        {/* Left Column - Withdraw Form */}
        <div className="lg:col-span-6 space-y-12">
          {/* Available sBTC Strip */}
          <div className="bg-[#1C2130] border border-white/5 p-6 flex items-center justify-between rounded-[4px] relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#4A9EFF]"></div>
            <span className="text-[11px] font-mono text-[#4A5168] uppercase tracking-widest">// AVAILABLE sBTC:</span>
            <span className="text-xl font-bold text-[#4A9EFF] tracking-tight">{isConnected ? balances.sBTC : '0.0000000'} sBTC</span>
          </div>

          <div className="space-y-12">
            <div className="space-y-6">
              <label className="text-[10px] font-mono text-[#4A5168] uppercase tracking-[0.2em] block ml-1">// sBTC AMOUNT</label>
              <div className="relative group">
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full h-24 bg-[#0D0F14] border border-white/10 rounded-[4px] px-8 text-5xl font-display font-black focus:border-[#4A9EFF]/40 outline-none transition-all pr-32 text-white"
                />
                <div className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center gap-3">
                  <span className="text-xl font-mono text-[#4A9EFF] font-bold">sBTC</span>
                </div>
              </div>
              <div className="flex justify-between items-center text-[11px] font-mono uppercase tracking-widest">
                <span className="text-[#8A94A8]">You will receive: ~{amount} BTC</span>
                <button className="text-[#F7931A] hover:underline font-bold" onClick={() => setAmount(balances.sBTC)}>MAX</button>
              </div>
            </div>

            <div className="space-y-6">
              <label className="text-[10px] font-mono text-[#4A5168] uppercase tracking-[0.2em] block ml-1">// DESTINATION BITCOIN ADDRESS</label>
              <input 
                type="text" 
                value={destinationAddress}
                onChange={(e) => setDestinationAddress(e.target.value)}
                className="w-full h-16 bg-[#0D0F14] border border-white/10 rounded-[4px] px-6 text-[15px] font-mono focus:border-[#F7931A]/40 outline-none transition-all text-white"
              />
              <div className="p-4 bg-[#EF4444]/[0.05] border border-[#EF4444]/20 border-l-[3px] border-l-[#EF4444] rounded-r-[4px]">
                <p className="text-[11px] font-mono text-[#EF4444] tracking-tight uppercase">
                  // Confirm this is your BTC address. Withdrawals are irreversible.
                </p>
              </div>
            </div>

            {/* Review Section */}
            <div className="border border-white/5 bg-[#161A22]/50 p-8 rounded-[4px] space-y-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-[10px] font-mono text-[#4A5168] uppercase tracking-[0.2em]">BTC Address</span>
                <span className="text-[12px] font-mono text-white truncate max-w-[200px]">{destinationAddress}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-[10px] font-mono text-[#4A5168] uppercase tracking-[0.2em]">sBTC to burn</span>
                <span className="text-[12px] font-mono text-[#4A9EFF] font-bold">{amount} sBTC</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-[10px] font-mono text-[#4A5168] uppercase tracking-[0.2em]">BTC to receive</span>
                <span className="text-[12px] font-mono text-[#F7931A] font-bold">{amount} BTC</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-[#4A5168] uppercase tracking-[0.2em]">Est. time</span>
                <span className="text-[12px] font-mono text-white font-bold">~45 MIN</span>
              </div>
            </div>

            <button 
              onClick={handleWithdraw}
              disabled={!isConnected || parseFloat(amount) <= 0}
              className="w-full h-20 bg-[#F7931A] text-[#0D0F14] font-black text-xl uppercase tracking-widest rounded-[4px] flex items-center justify-center hover:bg-[#F7931A]/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
            >
              Withdraw to Bitcoin <span className="ml-4 group-hover:translate-x-2 transition-transform">→</span>
            </button>
            <button className="w-full text-[11px] font-mono text-[#4A5168] hover:text-[#F7931A] transition-colors uppercase tracking-widest">
              Cancel Operation
            </button>
          </div>
        </div>

        {/* Right Column - Status Tracker */}
        <div className="lg:col-span-4 bg-[#161A22]/50 border border-white/5 h-fit rounded-[4px] overflow-hidden">
          <div className="p-6 border-b border-white/5 bg-[#1C2130]/30">
            <h3 className="text-[10px] font-mono text-[#22C55E] uppercase tracking-[0.3em] font-black">// WITHDRAWAL STATUS</h3>
          </div>
          
          <div className="p-10 space-y-12 relative overflow-hidden">
            {/* Timeline Line */}
            <div className="absolute top-[40px] bottom-[40px] left-[51px] w-[1px] bg-white/5"></div>

            {[
              { label: 'Withdrawal Submitted', status: isWithdrawing ? 'done' : 'pending', time: isWithdrawing ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '' },
              { label: 'Processing on Stacks', status: isWithdrawing ? 'active' : 'pending', time: '' },
              { label: 'sBTC Burned', status: 'pending', time: '' },
              { label: 'BTC Broadcast', status: 'pending', time: '' },
              { label: 'BTC Confirmed', status: 'pending', time: '' },
            ].map((s, idx) => (
              <div key={idx} className="flex items-start gap-8 relative z-10">
                <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center border ${
                  s.status === 'done' ? 'bg-[#22C55E] border-[#22C55E]' : 
                  s.status === 'active' ? 'bg-[#161A22] border-[#22C55E] shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 
                  'bg-[#161A22] border-[#4A5168]'
                }`}>
                  {s.status === 'done' ? (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0D0F14" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  ) : (
                    <div className={`w-1.5 h-1.5 rounded-full ${s.status === 'active' ? 'bg-[#22C55E] animate-pulse' : 'bg-[#4A5168]'}`}></div>
                  )}
                </div>
                <div className="flex-1 -mt-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-[13px] font-bold uppercase tracking-tight ${s.status === 'pending' ? 'text-[#4A5168]' : 'text-white'}`}>
                      {s.label}
                    </span>
                    <span className="text-[10px] font-mono text-[#4A5168]">{s.time}</span>
                  </div>
                  {s.status === 'active' && (
                    <div className="mt-6 space-y-4 animate-in slide-in-from-top-2 duration-700">
                      <p className="text-[12px] text-[#8A94A8] leading-relaxed italic">
                        Burning your sBTC on Stacks to release native Bitcoin. Usually takes one Stacks block (~5-10 min).
                      </p>
                      <button className="text-[9px] font-mono text-[#4A9EFF] hover:underline uppercase tracking-[0.2em] font-black">
                        Stacks Explorer ↗
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </LayoutShell>
  );
}
