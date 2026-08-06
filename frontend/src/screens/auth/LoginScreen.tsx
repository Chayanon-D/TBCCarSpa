import React, { useState } from 'react';
import { ScreenId, UserProfile } from '../../types';
import { ShieldCheck, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { useLiff } from '../../hooks/useLiff';
import { liffService } from '../../services/liff';

interface LoginScreenProps {
  user: UserProfile;
  onNavigate: (screen: ScreenId) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ user, onNavigate }) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { loginWithLine } = useLiff();

  const handleLineLogin = () => {
    setIsLoggingIn(true);
    if (liffService.isInitialized() && !liffService.isLoggedIn()) {
      loginWithLine();
    } else {
      setTimeout(() => {
        setIsLoggingIn(false);
        onNavigate('home');
      }, 800);
    }
  };

  return (
    <div className="min-h-full flex flex-col justify-between p-6 bg-[#0A0A0E] text-white">
      <div className="flex flex-col items-center text-center mt-2">
        <div className="w-16 h-16 rounded-full bg-[#06C755]/10 border border-[#06C755]/30 p-1 flex items-center justify-center mb-3">
          <img
            src={user.linePictureUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}
            alt="LINE Profile"
            className="w-full h-full rounded-full object-cover"
          />
        </div>

        <span className="text-[10px] uppercase font-mono tracking-wider text-[#06C755] bg-[#06C755]/10 px-2.5 py-0.5 rounded-full border border-[#06C755]/30 mb-1">
          LINE LIFF Single Sign-On
        </span>

        <h2 className="text-lg font-bold text-white">
          {user.lineDisplayName || 'คุณสมชาย ใจดี'}
        </h2>
        <p className="text-xs text-zinc-400">LINE ID: @tbc_carspa_official</p>
      </div>

      <div className="my-6 p-4 rounded-2xl bg-[#13131A] border border-[#D4AF37]/20 space-y-3">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
          <div>
            <h3 className="text-xs font-semibold text-zinc-200">เข้าสู่ระบบอัตโนมัติผ่าน LINE</h3>
            <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
              ระบบจะดึงข้อมูลโปรไฟล์และสถานะสมาชิกจากบัญชี LINE Official Account เพื่อมอบประสบการณ์ที่ดีที่สุด
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-zinc-800/80 space-y-2">
          <div className="flex items-center gap-2 text-[11px] text-zinc-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>ไม่ต้องจำรหัสผ่าน เชื่อมต่อผ่าน LINE Token & Prisma DB</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-zinc-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>รับแจ้งเตือนสถานะการล้างรถผ่าน LINE OA</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-zinc-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>รับคูปองพิเศษและแต้มสะสมทันที</span>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-2">
        <button
          onClick={handleLineLogin}
          disabled={isLoggingIn}
          className="w-full py-3.5 px-4 rounded-xl bg-[#06C755] hover:bg-[#05b34c] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,199,85,0.3)] active:scale-95 transition-all cursor-pointer disabled:opacity-50"
        >
          {isLoggingIn ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>กำลังเข้าสู่ระบบ...</span>
            </div>
          ) : (
            <>
              <span>อนุญาตและเข้าใช้งาน TBC CAR SPA</span>
              <ArrowRight className="w-4 h-4 ml-auto" />
            </>
          )}
        </button>

        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <p className="text-[10px] text-zinc-400">
            เข้าสู่ระบบอัตโนมัติผ่าน LINE Official Account
          </p>
        </div>
      </div>
    </div>
  );
};
