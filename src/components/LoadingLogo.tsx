'use client';

export default function LoadingLogo({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' }) {
  const sizeMap = {
    small: 'w-12 h-12',
    medium: 'w-24 h-24',
    large: 'w-48 h-48',
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative group">
        {/* Blurred Glow Effect */}
        <div className={`absolute inset-0 bg-[#F7931A] rounded-full blur-[40px] opacity-20 animate-pulse group-hover:opacity-40 transition-opacity`}></div>
        <div className={`absolute inset-0 bg-[#F7931A] rounded-full blur-[20px] opacity-10 animate-pulse delay-700`}></div>
        
        {/* Logo Image */}
        <img 
          src="/btcflow_logo.png" 
          alt="Loading..." 
          className={`${sizeMap[size]} relative z-10 object-contain animate-[float_3s_ease-in-out_infinite]`}
        />
      </div>
      
      <div className="flex flex-col items-center gap-1">
        <div className="h-[2px] w-24 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-[#F7931A] animate-[loading_2s_infinite]"></div>
        </div>
        <p className="text-[10px] font-mono text-[#4A5168] uppercase tracking-[0.3em] font-black italic mt-2 animate-pulse">
          // SYNCHRONIZING WITH BITCOIN L1
        </p>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
