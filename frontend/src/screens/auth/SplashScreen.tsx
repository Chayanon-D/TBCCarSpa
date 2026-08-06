import React, { useEffect } from 'react';
import { ScreenId } from '../../types';
import { Sparkles, Shield } from 'lucide-react';

interface SplashScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onNavigate }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onNavigate('home');
    }, 2000);
    return () => clearTimeout(timer);
  }, [onNavigate]);

  return (
    <div
      onClick={() => onNavigate('home')}
      className="relative min-h-full flex flex-col items-center justify-between p-8 bg-gradient-to-b from-[#181822] via-[#0D0D12] to-[#050507] text-white cursor-pointer select-none overflow-hidden"
    >
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-600/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex-1 flex flex-col items-center justify-center text-center z-10 my-auto">
        <div className="relative mb-6 group">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#FFE599] via-[#D4AF37] to-[#8A6A0B] p-[2px] shadow-[0_0_30px_rgba(212,175,55,0.35)] animate-pulse">
            <div className="w-full h-full bg-[#0F0F14] rounded-2xl flex flex-col items-center justify-center p-3">
              <span className="text-2xl font-black tracking-widest text-[#D4AF37]">
                TBC
              </span>
              <span className="text-[8px] font-mono tracking-widest text-zinc-400 uppercase mt-0.5">
                CAR SPA
              </span>
            </div>
          </div>
          <Sparkles className="w-6 h-6 text-[#D4AF37] absolute -top-2 -right-2 animate-bounce" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-amber-200 mb-2">
          TBC CAR SPA
        </h1>
        <p className="text-xs text-zinc-400 font-light max-w-[240px] leading-relaxed">
          The Ultimate Luxury Car Detailing & Executive Spa Experience
        </p>

        <div className="w-44 h-1 bg-zinc-800 rounded-full mt-10 overflow-hidden relative">
          <div className="h-full bg-gradient-to-r from-[#D4AF37] via-[#FFF0C2] to-[#D4AF37] w-full animate-pulse" />
        </div>
        <p className="text-[10px] text-zinc-500 font-mono mt-2">Connected to LINE LIFF App</p>
      </div>

      <div className="z-10 text-center flex flex-col items-center gap-2">
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 bg-[#161620] px-3 py-1 rounded-full border border-zinc-800">
          <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Connected with Prisma Database</span>
        </div>
        <p className="text-[10px] text-zinc-600">แตะเพื่อเข้าสู่ระบบ (Tap to Enter)</p>
      </div>
    </div>
  );
};
