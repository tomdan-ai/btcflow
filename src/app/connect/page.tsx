'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { getAddress } from 'sats-connect';
import LoadingLogo from '@/components/LoadingLogo';

export default function ConnectPage() {
  const router = useRouter();
  const { connect, isConnected, address, walletProvider, network } = useStore();
  const [isConnecting, setIsConnecting] = useState(false);
  const [provider, setProvider] = useState<string | null>(null);
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (isConnected) {
      const timer = setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isConnected, router]);

  const handleConnect = async (wProvider: 'XVERSE' | 'UNISAT' | 'TURNKEY') => {
    setIsConnecting(true);
    setProvider(wProvider);
    
    try {
      if (wProvider === 'XVERSE') {
        const netType = network === 'MAINNET' ? 'Mainnet' : 'Testnet';
        await getAddress({
          payload: {
            purposes: ['ordinals', 'payment', 'stacks'] as any,
            message: 'Connect to BTCFlow',
            network: { type: netType as any },
          },
          onFinish: (response) => {
            const addr = response.addresses.find(a => a.purpose === 'stacks')?.address || 
                         response.addresses.find(a => a.purpose === 'payment')?.address;
            if (addr) {
              connect(addr, 'XVERSE');
            }
            setIsConnecting(false);
          },
          onCancel: () => {
            setIsConnecting(false);
          },
        });
      } else if (wProvider === 'UNISAT') {
        if (typeof (window as any).unisat !== 'undefined') {
          const accounts = await (window as any).unisat.requestAccounts();
          if (accounts[0]) {
            connect(accounts[0], 'UNISAT');
          }
        } else {
          alert('Unisat wallet not detected. Please install it.');
        }
        setIsConnecting(false);
      } else if (wProvider === 'TURNKEY') {
        setTimeout(() => {
          connect(email || 'dev@btcflow.xyz', 'TURNKEY');
          setIsConnecting(false);
        }, 1500);
      }
    } catch (error) {
      console.error('Connection failed:', error);
      setIsConnecting(false);
    }
  };

  if (isConnected) {
    return (
      <div className="min-h-screen bg-[#0D0F14] flex items-center justify-center p-6">
        <div className="max-w-[420px] w-full bg-[#161A22] border border-[#F7931A]/20 p-10 rounded-[12px] text-center space-y-10">
          <LoadingLogo size="medium" />
          <div className="space-y-2">
            <h1 className="text-2xl font-bold font-display text-white italic tracking-tighter uppercase">CONNECTED</h1>
            <p className="text-[11px] text-[#8A94A8] font-mono uppercase tracking-[0.2em]">
              SESSION SECURED WITH {walletProvider}
            </p>
          </div>
          <div className="bg-[#0D0F14] p-4 rounded-lg border border-white/5 font-mono text-[11px] text-[#F7931A] break-all">
            {address}
          </div>
          <Link 
            href="/dashboard"
            className="inline-block w-full h-[54px] bg-white text-black font-black uppercase tracking-widest text-[12px] rounded-[4px] flex items-center justify-center hover:bg-white/90 transition-all active:scale-[0.98]"
          >
            Enter Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0D0F14] flex flex-col md:flex-row font-body text-white">
      {/* Visual Column */}
      <div className="hidden md:flex flex-1 relative overflow-hidden bg-[#0D0F14] border-r border-white/5 items-center justify-center">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#F7931A_1px,transparent_0)] bg-[size:40px_40px]"></div>
        <div className="relative z-10 p-12 max-w-[500px] space-y-6 text-center">
          <div className="h-px w-24 bg-[#F7931A] mx-auto"></div>
          <h2 className="text-5xl font-display font-black leading-tight tracking-tighter">
            YOUR BITCOIN.<br />UNLOCKED.
          </h2>
          <p className="text-[#8A94A8] text-lg leading-relaxed">
            Connect your preferred wallet to start bridging, swapping, and earning yield on history's most secure network.
          </p>
        </div>
      </div>

      {/* Auth Column */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#0D0F14]">
        <div className="max-w-[400px] w-full space-y-10">
          <div className="space-y-2 text-center md:text-left">
            <Link href="/" className="inline-block">
              <div className="flex items-center gap-3">
                <img src="/btcflow_logo.png" alt="BTCFlow Logo" className="w-10 h-10 object-contain" />
                <h1 className="text-3xl font-display font-bold uppercase tracking-tighter">
                  <span className="text-[#F7931A]">BTC</span>Flow
                </h1>
              </div>
            </Link>
            <p className="text-[#8A94A8] text-[14px]">Choose your gateway to Bitcoin DeFi</p>
          </div>

          <div className="space-y-4">
            <p className="text-[11px] font-mono text-[#4A5168] uppercase tracking-[0.2em] mb-4">// CONNECT WALLET</p>
            <button 
              onClick={() => handleConnect('XVERSE')}
              disabled={isConnecting}
              className="w-full h-[64px] bg-[#161A22] border border-white/10 rounded-[10px] px-6 flex items-center justify-between hover:border-[#F7931A]/40 transition-all group active:scale-[0.98] disabled:opacity-50"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center font-bold text-lg italic text-[#F7931A]">X</div>
                <div className="text-left">
                  <span className="font-bold text-[15px] group-hover:text-white transition-colors block">Xverse Wallet</span>
                  <span className="text-[10px] text-[#4A5168] font-mono uppercase">Multi-chain ready</span>
                </div>
              </div>
              <span className="text-[#4A5168] group-hover:text-white transition-colors">→</span>
            </button>

            <button 
              onClick={() => handleConnect('UNISAT')}
              disabled={isConnecting}
              className="w-full h-[64px] bg-[#161A22] border border-white/10 rounded-[10px] px-6 flex items-center justify-between hover:border-[#F7931A]/40 transition-all group active:scale-[0.98] disabled:opacity-50"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[#fbd103] flex items-center justify-center font-bold text-lg text-black">U</div>
                <div className="text-left">
                  <span className="font-bold text-[15px] group-hover:text-white transition-colors block">Unisat Wallet</span>
                  <span className="text-[10px] text-[#4A5168] font-mono uppercase">Bitcoin Native</span>
                </div>
              </div>
              <span className="text-[#4A5168] group-hover:text-white transition-colors">→</span>
            </button>

            <div className="relative py-4 flex items-center">
              <div className="flex-grow border-t border-white/5"></div>
              <span className="flex-shrink mx-4 text-[10px] font-mono text-[#4A5168]">OR USE EMAIL</span>
              <div className="flex-grow border-t border-white/5"></div>
            </div>

            <div className="space-y-4">
              <input 
                type="email" 
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-[54px] bg-[#0D0F14] border border-white/10 rounded-[10px] px-4 font-body focus:border-[#F7931A]/40 outline-none transition-all placeholder:text-[#4A5168] text-white"
              />
              <button 
                onClick={() => handleConnect('TURNKEY')}
                disabled={isConnecting}
                className="w-full h-[54px] bg-[#F7931A] hover:bg-[#F7931A]/90 text-[#0D0F14] font-bold rounded-[10px] transition-all disabled:opacity-50 uppercase tracking-widest text-[12px]"
              >
                {isConnecting && provider === 'TURNKEY' ? 'Sending Magic Link...' : 'Send Magic Link'}
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 text-center">
            <p className="text-[11px] text-[#4A5168] leading-relaxed uppercase tracking-wider">
              Protected by <span className="text-white">Stacks PoX</span> & <span className="text-white">TurnKey TEE</span>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
