import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0D0F14] text-white selection:bg-[#F7931A] selection:text-[#0D0F14]">
      {/* Dot Grid Background Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_0)] bg-[size:24px_24px]"></div>

      {/* Navigation */}
      <header className="h-[64px] sticky top-0 bg-[#0D0F14]/80 backdrop-blur-sm border-b border-white/5 px-8 flex items-center justify-between z-50">
        <div className="flex items-center gap-1">
          <span className="text-[#F7931A] font-bold text-2xl font-display">BTC</span>
          <span className="text-white font-bold text-2xl font-display">Flow</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-[14px] font-mono text-[#8A94A8] hover:text-[#F7931A] hover:underline decoration-[#F7931A] underline-offset-4 transition-all">Features</Link>
          <Link href="#how-it-works" className="text-[14px] font-mono text-[#8A94A8] hover:text-[#F7931A] hover:underline decoration-[#F7931A] underline-offset-4 transition-all">How It Works</Link>
          <Link href="#about" className="text-[14px] font-mono text-[#8A94A8] hover:text-[#F7931A] hover:underline decoration-[#F7931A] underline-offset-4 transition-all">About</Link>
        </nav>

        <Link href="/dashboard" className="bg-[#F7931A] text-[#0D0F14] font-bold px-7 py-2.5 rounded-[10px] text-[14px] hover:opacity-90 transition-opacity">
          Launch App
        </Link>
      </header>

      {/* Hero Section */}
      <section className="h-[calc(100vh-64px)] flex flex-col items-center justify-center text-center px-4 relative">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="text-[#F7931A] font-mono text-[12px] tracking-widest">// BITCOIN DEFI, SIMPLIFIED</span>
            <span className="w-[2px] h-[14px] bg-[#F7931A] animate-pulse"></span>
          </div>

          <h1 className="text-6xl md:text-8xl font-display font-extrabold leading-[1.1] mb-8">
            Bitcoin DeFi. <br />
            <span className="text-[#F7931A]">Zero Setup.</span>
          </h1>

          <p className="text-[18px] md:text-[20px] text-[#8A94A8] max-w-[520px] mx-auto mb-10 font-body leading-relaxed">
            Connect your Bitcoin wallet. Use DeFi on Stacks. No Stacks wallet needed. Ever.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/dashboard" className="w-full md:w-auto bg-[#F7931A] text-[#0D0F14] font-bold px-8 py-4 rounded-[10px] text-[16px] hover:opacity-90 transition-opacity">
              Launch App →
            </Link>
            <Link href="#how-it-works" className="w-full md:w-auto border border-white/10 text-white font-bold px-8 py-4 rounded-[10px] text-[16px] hover:bg-white/5 transition-colors">
              See How It Works
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#F7931A]"></div>
              <span className="font-mono text-[11px] text-[#8A94A8] uppercase tracking-wider">sBTC Powered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#F7931A]"></div>
              <span className="font-mono text-[11px] text-[#8A94A8] uppercase tracking-wider">Self-Custodial</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#F7931A]"></div>
              <span className="font-mono text-[11px] text-[#8A94A8] uppercase tracking-wider">Live on Testnet</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 max-w-[1200px] mx-auto px-8">
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-16 text-center md:text-left">How It Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-[40px] left-[50px] right-[50px] h-[1px] bg-white/5 -z-10"></div>
          
          {[
            { step: '01', title: 'Connect Wallet', desc: 'Connect Unisat or Xverse with a single click.' },
            { step: '02', title: 'Deposit BTC', desc: 'Send native BTC to get sBTC on Stacks.' },
            { step: '03', title: 'Use DeFi', desc: 'Swap, lend, and earn yield natively.' },
            { step: '04', title: 'Withdraw BTC', desc: 'Burn sBTC to receive native BTC anytime.' },
          ].map((item, idx) => (
            <div key={idx} className="relative">
              <span className="absolute -top-10 -left-4 text-[120px] font-mono text-[#F7931A]/[0.05] leading-none select-none -z-10">{item.step}</span>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-[#8A94A8] text-[15px] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-[#111318]/50">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-16">
            {[
              { title: 'No Stacks Wallet Required', desc: 'Use your favorite Bitcoin wallet. We handle the Stacks account for you.' },
              { title: 'One-Click sBTC Bridge', desc: 'Seamlessly move assets between Bitcoin and Stacks in a single interface.' },
              { title: 'ALEX, Zest, BitFlow Integrated', desc: 'Access the best of Stacks DeFi directly from your dashboard.' },
              { title: 'Real-time Bridge Status', desc: 'Know exactly where your funds are with our detailed bridge tracker.' },
              { title: 'Self-Custodial Always', desc: 'Your keys, your Bitcoin. No middleman, no custodial risk.' },
              { title: 'Bitcoin-Native UX', desc: 'The dashboard you expect, without the multi-chain complexity.' },
            ].map((feature, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-5 h-5 bg-[#F7931A] shrink-0 mt-1 rounded-sm shadow-[0_0_15px_rgba(247,147,26,0.2)]"></div>
                <div>
                  <h4 className="text-[16px] font-bold mb-2">{feature.title}</h4>
                  <p className="text-[#8A94A8] text-[14px] leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-[#0D0F14]">
        <div className="max-w-[1200px] mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <div className="flex items-center gap-1 mb-2">
              <span className="text-[#F7931A] font-bold text-lg font-display">BTC</span>
              <span className="text-white font-bold text-lg font-display">Flow</span>
            </div>
            <p className="text-[#4A5168] text-[12px] font-mono uppercase tracking-widest">Bitcoin DeFi, Simplified.</p>
          </div>

          <div className="flex gap-8">
            <Link href="#" className="font-mono text-[12px] text-[#4A5168] hover:text-[#F7931A]">Docs</Link>
            <Link href="#" className="font-mono text-[12px] text-[#4A5168] hover:text-[#F7931A]">GitHub</Link>
            <Link href="#" className="font-mono text-[12px] text-[#4A5168] hover:text-[#F7931A]">Discord</Link>
          </div>

          <div className="text-[#4A5168] text-[12px] font-mono">
            © 2026 BTCFlow Team
          </div>
        </div>
      </footer>
    </div>
  );
}
