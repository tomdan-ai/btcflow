'use client';

import { useState, useEffect } from 'react';
import LayoutShell from '@/components/LayoutShell';
import { useStore } from '@/store/useStore';
import { sendBtcTransaction } from 'sats-connect';
import LoadingLogo from '@/components/LoadingLogo';

export default function DepositPage() {
  const { balances, addTransaction, isConnected, address } = useStore();
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('0.01');
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds

  useEffect(() => {
    if (step !== 2) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [step]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDeposit = async () => {
    if (!isConnected || !address) return;
    
    console.log(`[Deposit] Initiating real on-chain peg-in for ${amount} BTC`);
    
    try {
      const satoshis = Math.floor(parseFloat(amount) * 100000000);
      const recipientAddress = 'tb1qj80p6y3w8f7r9w3v6z5y2x8t6a1l6r7e4p9m5q'; // sBTC vault address
      
      let txId = '';
      
      if ((window as any).useStore?.getState().walletProvider === 'XVERSE') {
        await sendBtcTransaction({
          payload: {
            network: { type: 'Testnet' as any },
            recipients: [{ address: recipientAddress, amountSats: BigInt(satoshis) }],
            senderAddress: address,
          },
          onFinish: (response) => {
            txId = response;
            console.log(`[Deposit] Xverse Broadcast Success: ${txId}`);
            addTransaction({
              type: 'Deposit',
              amount: `${amount} BTC`,
              txId,
              chain: 'BTC',
              details: `Real Peg-in to ${recipientAddress}`
            });
            setStep(2);
          },
          onCancel: () => console.log('[Deposit] User cancelled'),
        });
      } else if ((window as any).unisat) {
        txId = await (window as any).unisat.sendBitcoin(recipientAddress, satoshis);
        console.log(`[Deposit] Unisat Broadcast Success: ${txId}`);
        addTransaction({
          type: 'Deposit',
          amount: `${amount} BTC`,
          txId,
          chain: 'BTC',
          details: `Real Peg-in to ${recipientAddress}`
        });
        setStep(2);
      } else {
        // Fallback for Turnkey or others
        alert('Please use a compatible wallet for real transactions.');
      }
    } catch (error) {
      console.error('[Deposit] Broadcast failed:', error);
      alert('Transaction broadcast failed. check console for details.');
    }
  };

  return (
    <LayoutShell>
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-white/5 pb-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-display font-black text-white italic tracking-tighter uppercase">Deposit BTC</h2>
          <p className="text-[10px] font-mono text-[#F7931A] uppercase tracking-[0.2em] font-black italic">// Bridge Bitcoin to Stacks (sBTC Peg-in)</p>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-mono text-[#4A5168] uppercase tracking-widest">
          <span>1 BTC = 1 sBTC (1:1 peg)</span>
          <div className="w-4 h-4 rounded-full border border-white/10 flex items-center justify-center cursor-help">?</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-16">
        {/* Left Column - Deposit Form */}
        <div className="lg:col-span-6 space-y-12">
          {/* Step Indicator */}
          <div className="flex items-center justify-between max-w-[500px]">
            {[
              { num: '01', label: 'Enter Amount' },
              { num: '02', label: 'Send BTC' },
              { num: '03', label: 'Receiving sBTC' },
            ].map((s, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${step >= idx + 1 ? 'bg-[#F7931A]' : 'border border-[#4A5168]'}`}></div>
                <span className={`text-[10px] font-mono uppercase tracking-widest ${step >= idx + 1 ? 'text-white' : 'text-[#4A5168]'}`}>
                  {s.label}
                </span>
                {idx < 2 && <div className="w-8 h-[1px] bg-white/5 hidden sm:block"></div>}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-12">
              <div className="space-y-6">
                <label className="text-[10px] font-mono text-[#4A5168] uppercase tracking-[0.2em] block ml-1">// BTC AMOUNT TO DEPLOY</label>
                <div className="relative group">
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full h-24 bg-[#0D0F14] border border-white/10 rounded-[4px] px-8 text-5xl font-display font-black focus:border-[#F7931A]/40 outline-none transition-all pr-32 text-white"
                  />
                  <div className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center gap-3">
                    <span className="text-xl font-mono text-[#F7931A] font-bold">BTC</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-[11px] font-mono uppercase tracking-wider">
                  <span className="text-[#8A94A8]">Available: {isConnected ? balances.BTC : '0.00'} BTC</span>
                  <button className="text-[#F7931A] hover:underline font-bold" onClick={() => setAmount(balances.BTC)}>MAX</button>
                </div>
              </div>

              <div className="p-6 bg-[#161A22] border border-white/5 rounded-[4px] flex justify-between items-center group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#4A9EFF]"></div>
                <div className="space-y-1">
                  <div className="text-[14px] font-bold text-white flex items-center gap-2 uppercase tracking-tight">
                    Estimated Receiving: ~{amount} sBTC
                  </div>
                  <div className="text-[10px] text-[#4A5168] font-mono uppercase tracking-widest">BRIDGE FEE (L1 Miner): 0.00001 BTC</div>
                </div>
                <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-[#4A9EFF] group-hover:scale-110 transition-transform font-black">BTC → sBTC</div>
              </div>

              <button 
                onClick={handleDeposit}
                disabled={!isConnected || parseFloat(amount) <= 0}
                className="w-full h-20 bg-[#F7931A] text-[#0D0F14] font-black text-xl uppercase tracking-widest rounded-[4px] flex items-center justify-center hover:bg-[#F7931A]/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
              >
                Initiate Deposit <span className="ml-4 group-hover:translate-x-2 transition-transform">→</span>
              </button>
              {!isConnected && <p className="text-center text-[10px] font-mono text-[#EF4444] uppercase tracking-widest italic">Connect wallet to begin peg-in</p>}
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in zoom-in-95 duration-500 space-y-12">
              <div className="space-y-6">
                <h3 className="text-2xl font-black font-display text-white uppercase italic tracking-tight">Send BTC to this address</h3>
                <div className="bg-[#0D0F14] border border-[#F7931A]/30 rounded-[4px] p-8 flex items-center justify-between group">
                  <span className="font-mono text-white text-[16px] break-all tracking-tight selection:bg-[#F7931A] selection:text-[#0D0F14]">
                    tb1qj80p6y3w8f7r9w3v6z5y2x8t6a1l6r7e4p9m5q
                  </span>
                  <button className="p-4 bg-white/5 rounded-[4px] hover:bg-white/10 transition-colors text-[#F7931A]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>
                  </button>
                </div>
                
                <div className="flex flex-col items-center py-12 bg-[#161A22]/30 border border-white/5 rounded-[4px] space-y-8">
                  <LoadingLogo size="medium" />
                  <p className="text-[12px] text-[#8A94A8] font-mono animate-pulse tracking-widest uppercase italic font-black text-center">// Awaiting Bitcoin L1 Broadcast...</p>
                </div>
              </div>

              <div className="p-6 border border-white/5 rounded-[4px] bg-[#161A22] flex items-center justify-between border-l-[3px] border-l-[#F7931A]">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-[#F7931A] animate-ping"></div>
                  <span className="text-[12px] text-white font-mono uppercase tracking-widest">Single-use address expires in:</span>
                </div>
                <span className="font-mono text-[#F7931A] font-black text-xl">{formatTime(timeLeft)}</span>
              </div>

              <button 
                onClick={() => setStep(1)}
                className="w-full h-16 border border-white/10 text-[#4A5168] font-bold uppercase tracking-widest rounded-[4px] hover:bg-white/5 transition-all text-sm"
              >
                Back to Edit
              </button>
            </div>
          )}
        </div>

        {/* Right Column - Status Tracker */}
        <div className="lg:col-span-4 bg-[#161A22]/50 border border-white/5 h-fit rounded-[4px] overflow-hidden">
          <div className="p-6 border-b border-white/5 bg-[#1C2130]/30">
            <h3 className="text-[10px] font-mono text-[#F7931A] uppercase tracking-[0.3em] font-black">// BRIDGE STATUS</h3>
          </div>
          
          <div className="p-10 space-y-12 relative overflow-hidden">
            {/* Timeline Line */}
            <div className="absolute top-[40px] bottom-[40px] left-[51px] w-[1px] bg-white/5"></div>

            {[
              { label: 'Transaction Detected', status: step >= 2 ? 'done' : 'pending', time: step >= 2 ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '' },
              { label: 'Bitcoin Confirming (2/6)', status: step >= 2 ? 'active' : 'pending', time: '' },
              { label: 'sBTC Minting', status: 'pending', time: '' },
              { label: 'sBTC Available', status: 'pending', time: '' },
            ].map((s, idx) => (
              <div key={idx} className="flex items-start gap-8 relative z-10">
                <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center border ${
                  s.status === 'done' ? 'bg-[#F7931A] border-[#F7931A]' : 
                  s.status === 'active' ? 'bg-[#161A22] border-[#F7931A] shadow-[0_0_10px_rgba(247,147,26,0.3)]' : 
                  'bg-[#161A22] border-[#4A5168]'
                }`}>
                  {s.status === 'done' ? (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0D0F14" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  ) : (
                    <div className={`w-1.5 h-1.5 rounded-full ${s.status === 'active' ? 'bg-[#F7931A] animate-pulse' : 'bg-[#4A5168]'}`}></div>
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
                    <div className="space-y-4 mt-6 animate-in slide-in-from-top-2 duration-700">
                      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-[#F7931A] w-1/3 animate-pulse"></div>
                      </div>
                      <p className="text-[11px] text-[#8A94A8] leading-relaxed italic">
                        Estimated time remaining: <span className="text-white not-italic">~25 min</span>
                      </p>
                      <button className="text-[9px] font-mono text-[#4A9EFF] hover:underline uppercase tracking-[0.2em] font-black">
                        Mempool.space Tracker ↗
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
