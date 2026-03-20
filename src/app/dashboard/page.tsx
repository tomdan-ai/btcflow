'use client';

import Link from 'next/link';
import LayoutShell from '@/components/LayoutShell';
import { useStore } from '@/store/useStore';

export default function DashboardPage() {
  const { balances, transactions, isConnected, address } = useStore();
  
  // Show only 4 most recent
  const recentTransactions = transactions.slice(0, 4);

  return (
    <LayoutShell>
      <div className="space-y-12">
        {/* Row 1 - Balance Strip */}
        <section className="border-y border-[rgba(255,255,255,0.07)] -mx-8 px-8 py-6 grid grid-cols-1 md:grid-cols-3 divide-x divide-[rgba(255,255,255,0.07)]">
          <div className="flex flex-col gap-2 pr-6">
            <span className="text-[10px] font-mono text-[#4A5168] uppercase tracking-widest">// BITCOIN BALANCE</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-display text-[#F7931A] tracking-tighter">
                {isConnected ? balances.BTC : '0.000000'}
              </span>
              <span className="text-sm font-mono text-[#F7931A]/60">BTC</span>
            </div>
            <span className="text-[11px] font-mono text-[#4A5168] truncate">
              {isConnected ? address : 'NOT CONNECTED'}
            </span>
          </div>
          
          <div className="flex flex-col gap-2 px-6">
            <span className="text-[10px] font-mono text-[#4A5168] uppercase tracking-widest">// sBTC BALANCE</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-display text-[#4A9EFF] tracking-tighter">
                {isConnected ? balances.sBTC : '0.0000000'}
              </span>
              <span className="text-sm font-mono text-[#4A9EFF]/60">sBTC</span>
            </div>
            <span className="text-[11px] font-mono text-[#4A5168]">
              {isConnected ? 'SP3K...N5B8' : 'NOT CONNECTED'}
            </span>
          </div>

          <div className="flex flex-col gap-2 pl-6">
            <span className="text-[10px] font-mono text-[#4A5168] uppercase tracking-widest">// PORTFOLIO VALUE</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-display text-white tracking-tighter">
                ${isConnected ? balances.USD : '0.00'}
              </span>
              <span className="text-sm font-mono text-[#4A5168]">USD</span>
            </div>
            <span className="text-[10px] font-mono text-[#4A5168] uppercase tracking-wider">
              UPDATED {isConnected ? '30S AGO' : '---'}
            </span>
          </div>
        </section>

        {/* Row 2 - Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-12">
          {/* Left Column: Recent Activity */}
          <section className="lg:col-span-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[10px] font-mono text-[#4A5168] uppercase tracking-[0.2em] flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#F7931A]"></div>
                RECENT ACTIVITY
              </h3>
              <Link href="/history" className="text-[10px] font-mono text-[#8A94A8] hover:text-[#F7931A] transition-colors uppercase tracking-widest">
                Full History →
              </Link>
            </div>
            
            <div className="min-h-[300px] border border-white/5 rounded-[4px] bg-[#161A22]/50 flex flex-col">
              {recentTransactions.length > 0 ? (
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-mono text-[#4A5168] border-b border-white/5 uppercase tracking-widest">
                      <th className="px-6 py-4 font-normal">TYPE</th>
                      <th className="px-6 py-4 font-normal">AMOUNT</th>
                      <th className="px-6 py-4 font-normal">STATUS</th>
                      <th className="px-6 py-4 font-normal">TIME</th>
                    </tr>
                  </thead>
                  <tbody className="text-[13px] font-mono">
                    {recentTransactions.map((tx) => (
                      <tr key={tx.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <div className={`w-6 h-6 rounded flex items-center justify-center bg-white/5 text-[10px] ${
                            tx.type === 'Deposit' ? 'text-[#F7931A]' : 
                            tx.type === 'Withdraw' ? 'text-[#22C55E]' : 
                            'text-[#4A9EFF]'
                          }`}>
                            {tx.type === 'Deposit' ? '↓' : tx.type === 'Withdraw' ? '↑' : '⇆'}
                          </div>
                          <span className="text-white group-hover:text-[#F7931A] transition-colors font-bold">{tx.type}</span>
                        </td>
                        <td className={`px-6 py-4 font-bold ${tx.type === 'Withdraw' ? 'text-[#EF4444]' : 'text-[#F7931A]'}`}>
                          {tx.type === 'Withdraw' ? '-' : '+'}{tx.amount}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${tx.status === 'Confirmed' ? 'bg-[#22C55E]' : 'bg-[#F7931A]'}`}></div>
                            <span className="text-[#8A94A8]">{tx.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[#4A5168]">{tx.date.split(',')[0]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center opacity-30 space-y-4 py-20">
                  <div className="w-12 h-12 border border-dashed border-white/20 rounded-full flex items-center justify-center text-xl">
                    ∅
                  </div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em]">No recent activity found</p>
                </div>
              )}
            </div>
          </section>

          {/* Right Column: Quick Actions */}
          <section className="lg:col-span-4 space-y-4">
            <h3 className="text-[10px] font-mono text-[#4A5168] uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#4A9EFF]"></div>
              QUICK ACTIONS
            </h3>

            <QuickActionCard 
              title="Deposit BTC" 
              desc="Get sBTC to use in DeFi" 
              href="/deposit"
              color="border-l-[#F7931A]"
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M19 12l-7 7-7-7"></path></svg>}
            />
            <QuickActionCard 
              title="Swap sBTC" 
              desc="Trade sBTC for other tokens" 
              href="/swap"
              color="border-l-[#4A9EFF]"
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m16 3 4 4-4 4"></path><path d="M20 7H4"></path><path d="m8 21-4-4 4-4"></path><path d="M4 17h16"></path></svg>}
            />
            <QuickActionCard 
              title="Earn Yield" 
              desc="Stake sBTC and earn rewards" 
              href="/defi"
              color="border-l-[#A855F7]"
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>}
            />
            <QuickActionCard 
              title="Withdraw to BTC" 
              desc="Redeem sBTC for native BTC" 
              href="/withdraw"
              color="border-l-[#22C55E]"
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7"></path></svg>}
            />
          </section>
        </div>

        {/* Row 3 - Bridge Status Panel */}
        <section className="border-t border-[rgba(255,255,255,0.07)] pt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-mono text-[#4A5168] uppercase tracking-[0.2em]">// BRIDGE STATUS</h3>
            {isConnected && transactions.some(t => t.status === 'Pending') && (
              <span className="text-[10px] font-mono text-white bg-[#F7931A]/10 border border-[#F7931A]/20 px-2 py-0.5 rounded">1 ACTIVE OPERATION</span>
            )}
          </div>
          
          <div className="bg-[#161A22] border border-white/5 p-8 rounded-[4px] relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1/3 h-[2px] bg-[#F7931A] group-hover:w-1/2 transition-all"></div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-12">
              <div className="flex-1 space-y-6">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#F7931A] uppercase italic">
                  <span>BTC</span>
                  <span className="text-[#4A5168] mx-4 opacity-30">⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯</span>
                  <span>sBTC</span>
                </div>
                <div className="relative h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full bg-[#F7931A] transition-all duration-1000 ${isConnected && transactions.some(t => t.status === 'Pending') ? 'w-1/3 animate-pulse' : 'w-0'}`}></div>
                </div>
                <div className="flex justify-between text-[10px] font-mono text-[#4A5168] uppercase tracking-wider">
                  <span>{isConnected && transactions.some(t => t.status === 'Pending') ? '2 / 6 CONFIRMATIONS' : 'NO ACTIVE TRANSFERS'}</span>
                  <span>{isConnected && transactions.some(t => t.status === 'Pending') ? 'EST. TIME REMAINING: ~25 MIN' : ''}</span>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-[14px] font-bold text-white uppercase tracking-widest mb-1">
                  {isConnected && transactions.some(t => t.status === 'Pending') ? 'Minting 0.0050 sBTC' : 'Bridge Idle'}
                </p>
                <Link href="/history" className="text-[10px] font-mono text-[#F7931A] hover:underline uppercase tracking-tighter">
                  Explorer Tracker ↗
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </LayoutShell>
  );
}

function QuickActionCard({ title, desc, href, color, icon }: { title: string, desc: string, href: string, color: string, icon: React.ReactNode }) {
  return (
    <Link href={href} className={`group flex items-center justify-between p-5 border-l-[3px] ${color} bg-[#161A22] border border-y-white/5 border-r-white/5 hover:bg-[#1C2130] transition-all rounded-r-[4px]`}>
      <div className="flex items-center gap-4">
        <div className="text-[#8A94A8] group-hover:text-white transition-colors">
          {icon}
        </div>
        <div>
          <div className="font-bold text-white group-hover:text-[#F7931A] transition-colors">{title}</div>
          <div className="text-[12px] text-[#4A5168] font-body">{desc}</div>
        </div>
      </div>
      <span className="text-[#4A5168] group-hover:text-white transition-colors">→</span>
    </Link>
  );
}
