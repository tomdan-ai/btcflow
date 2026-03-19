'use client';

import { useWalletStore, Transaction } from '@/lib/store';
import { useMemo } from 'react';

export default function TransactionHistory() {
  const { transactions } = useWalletStore();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return '↓';
      case 'swap':
        return '⇄';
      case 'withdraw':
        return '↑';
      default:
        return '•';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {transactions.map((tx) => (
        <div
          key={tx.id}
          className="p-4 bg-gray-800 border border-gray-700 rounded-lg hover:border-gray-600 transition"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="text-2xl">{getTypeIcon(tx.type)}</div>
              <div className="flex-1">
                <p className="text-white font-medium capitalize">
                  {tx.type} {tx.fromToken} → {tx.toToken}
                </p>
                <p className="text-xs text-gray-400">{formatTime(new Date(tx.timestamp))}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-semibold">{tx.amount.toFixed(6)}</p>
              <p className={`text-xs font-medium capitalize ${getStatusColor(tx.status)}`}>
                {tx.status}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2 break-all">TXID: {tx.txid}</p>
        </div>
      ))}
    </div>
  );
}
