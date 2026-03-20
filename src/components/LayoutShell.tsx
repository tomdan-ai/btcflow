'use client';

import { useEffect } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useStore } from '@/store/useStore';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const { isConnected, refreshBalances, network } = useStore();

  useEffect(() => {
    if (isConnected) {
      // Initial refresh
      refreshBalances();

      // Poll every 30 seconds
      const interval = setInterval(() => {
        console.log('[LayoutShell] Triggering scheduled balance refresh');
        refreshBalances();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [isConnected, refreshBalances, network]);

  return (
    <div className="flex min-h-screen bg-[#0D0F14]">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-16 xl:ml-[240px] transition-all duration-300 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
