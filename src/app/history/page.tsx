'use client';

import React, { useState } from 'react';
import LayoutShell from '@/components/LayoutShell';
import { useStore } from '@/store/useStore';

export default function HistoryPage() {
  const { transactions, isConnected, balances } = useStore();
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [filterType, setFilterType] = useState('All Types');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-[#22C55E]';
      case 'Pending': return 'bg-[#F7931A]';
      case 'Processing': return 'bg-[#4A9EFF]';
      case 'Failed': return 'bg-[#EF4444]';
      default: return 'bg-[#4A5168]';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Deposit': return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F7931A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M19 12l-7 7-7-7"></path></svg>
      );
      case 'Withdraw': return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7"></path></svg>
      );
      case 'Swap': return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4A9EFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m16 3 4 4-4 4"></path><path d="M20 7H4"></path><path d="m8 21-4-4 4-4"></path><path d="M4 17h16"></path></svg>
      );
      default: return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8A94A8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
      );
    }
  };

  const filteredTransactions = filterType === 'All Types' 
    ? transactions 
    : transactions.filter(tx => tx.type === filterType);

  // Dynamic Stats Calculation
  const totalDeposited = transactions
    .filter(tx => tx.type === 'Deposit')
    .reduce((acc, tx) => acc + parseFloat(tx.amount.split(' ')[0]), 0);

  const sBTCConversion = transactions
    .filter(tx => tx.type === 'Deposit' && tx.status === 'Confirmed')
    .reduce((acc, tx) => acc + parseFloat(tx.amount.split(' ')[0]), 0);

  const netActivity = transactions
    .reduce((acc, tx) => {
      const val = parseFloat(tx.amount.split(' ')[0]);
      return tx.type === 'Withdraw' ? acc - val : acc + val;
    }, 0);

  return (
    <LayoutShell>
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-white/5 pb-6">
        <h2 className="text-4xl font-display font-black text-white italic tracking-tighter uppercase">History</h2>
        <div className="flex items-center gap-4">
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-[#161A22] border border-white/10 rounded-[8px] px-4 py-2 text-[12px] font-mono text-[#8A94A8] outline-none focus:border-[#F7931A]/40 transition-all cursor-pointer"
          >
            <option>All Types</option>
            <option>Deposit</option>
            <option>Withdraw</option>
            <option>Swap</option>
          </select>
          <div className="bg-[#161A22] border border-white/10 rounded-[8px] px-4 py-2 text-[12px] font-mono text-[#4A5168] uppercase tracking-widest">
            {new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Summary Strip */}
      <section className="border-y border-white/5 -mx-8 px-8 py-6 mb-8 grid grid-cols-1 md:grid-cols-3 divide-x divide-white/5">
        <div className="space-y-1 pr-6">
          <div className="text-[10px] font-mono text-[#4A5168] uppercase tracking-widest">// TOTAL DEPOSITED</div>
          <div className="text-[20px] font-display font-bold text-white tracking-tight">
            {totalDeposited.toFixed(6)} <span className="text-[12px] font-mono text-[#4A5168]">BTC</span>
          </div>
        </div>
        <div className="space-y-1 px-6">
          <div className="text-[10px] font-mono text-[#4A5168] uppercase tracking-widest">// NET ACTIVITY</div>
          <div className="text-[20px] font-display font-bold text-white tracking-tight">
            {netActivity >= 0 ? '+' : ''}{netActivity.toFixed(6)} <span className="text-[12px] font-mono text-[#4A5168]">BTC</span>
          </div>
        </div>
        <div className="space-y-1 pl-6">
          <div className="text-[10px] font-mono text-[#4A5168] uppercase tracking-widest">// sBTC CONVERSION</div>
          <div className="text-[20px] font-display font-bold text-[#F7931A] tracking-tight">
            {sBTCConversion.toFixed(7)} <span className="text-[12px] font-mono text-[#4A5168]">sBTC</span>
          </div>
        </div>
      </section>

      {/* Transaction Table */}
      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full">
          <thead>
            <tr className="text-[10px] font-mono text-[#4A5168] uppercase tracking-[0.2em] border-b border-white/5">
              <th className="px-6 py-4 font-normal text-left">TYPE</th>
              <th className="px-6 py-4 font-normal text-left">AMOUNT</th>
              <th className="px-6 py-4 font-normal text-left">STATUS</th>
              <th className="px-6 py-4 font-normal text-left">DATE / TIME</th>
              <th className="px-6 py-4 font-normal text-left">TX ID</th>
              <th className="px-6 py-4 font-normal text-left">CHAIN</th>
              <th className="px-6 py-4 font-normal text-right">DETAILS</th>
            </tr>
          </thead>
          <tbody className="text-[13px] font-mono">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx) => (
                <React.Fragment key={tx.id}>
                  <tr 
                    className={`group cursor-pointer hover:bg-white/[0.02] transition-colors border-b border-white/5 ${expandedRow === tx.id ? 'bg-white/[0.03]' : ''}`}
                    onClick={() => setExpandedRow(expandedRow === tx.id ? null : tx.id)}
                  >
                    <td className="px-6 py-5 flex items-center gap-3">
                      {getTypeIcon(tx.type)}
                      <span className="font-bold text-white group-hover:text-[#F7931A] transition-colors">{tx.type}</span>
                    </td>
                    <td className={`px-6 py-5 font-bold ${tx.type === 'Withdraw' ? 'text-[#EF4444]' : 'text-[#F7931A]'}`}>
                      {tx.type === 'Withdraw' ? '-' : '+'}{tx.amount}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(tx.status)} ${tx.status === 'Processing' ? 'animate-pulse' : ''}`}></div>
                        <span className="text-white">{tx.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-[#8A94A8] whitespace-nowrap">{tx.date}</td>
                    <td className="px-6 py-5 text-[#4A5168] font-bold">{tx.txId}</td>
                    <td className="px-6 py-5">
                      <span className={`text-[9px] px-2 py-0.5 rounded border border-white/10 ${tx.chain === 'BTC' ? 'text-[#F7931A]' : 'text-[#4A9EFF]'}`}>
                        {tx.chain}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right text-[#4A5168] group-hover:text-white transition-colors">
                      {expandedRow === tx.id ? '▴' : '›'}
                    </td>
                  </tr>
                  {expandedRow === tx.id && (
                    <tr className="bg-white/[0.01] border-b border-white/5 animate-in fade-in slide-in-from-top-2 duration-300">
                      <td colSpan={7} className="p-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                          <div className="space-y-2">
                            <p className="text-[9px] text-[#4A5168] uppercase tracking-widest">// FULL TRANSACTION HASH</p>
                            <p className="text-[11px] text-white break-all leading-relaxed">
                              {tx.id}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <p className="text-[9px] text-[#4A5168] uppercase tracking-widest">// BLOCK HEIGHT</p>
                            <p className="text-[11px] text-white">{tx.status === 'Confirmed' ? '842,912' : 'PENDING...'}</p>
                          </div>
                          <div className="space-y-2">
                            <p className="text-[9px] text-[#4A5168] uppercase tracking-widest">// FEE PAID</p>
                            <p className="text-[11px] text-white">0.000012 BTC</p>
                          </div>
                          <div className="space-y-2">
                            <p className="text-[9px] text-[#4A5168] uppercase tracking-widest">// EXTERNAL EXPLORER</p>
                            <div className="flex gap-4">
                              <button className="text-[10px] text-[#4A9EFF] hover:underline uppercase tracking-tighter">Mempool.space ↗</button>
                            </div>
                          </div>
                        </div>
                        <div className="mt-8 pt-6 border-t border-white/5">
                          <p className="text-[12px] text-[#8A94A8] italic">"{tx.details}"</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-24 text-center">
                  <div className="flex flex-col items-center justify-center opacity-30 space-y-4">
                    <div className="w-16 h-16 border-2 border-dashed border-white/20 rounded-full flex items-center justify-center text-3xl">
                      ∅
                    </div>
                    <p className="text-[12px] font-mono uppercase tracking-[0.3em]">No activity records found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-12 flex justify-between items-center text-[11px] font-mono text-[#4A5168] uppercase tracking-widest">
        <div className="flex gap-4">
          <button className="hover:text-white transition-colors disabled:opacity-30" disabled>← PREVIOUS</button>
          <button className="hover:text-white transition-colors disabled:opacity-30" disabled>NEXT →</button>
        </div>
        <div>
          <button className="hover:text-[#F7931A] transition-colors tracking-tighter">EXPORT CSV ⭳</button>
        </div>
      </div>
    </LayoutShell>
  );
}
