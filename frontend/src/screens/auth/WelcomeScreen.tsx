import React from 'react';
import { ScreenId } from '../../types';
import { Sparkles, ArrowRight, ShieldCheck, UserPlus, LogIn, Crown } from 'lucide-react';

interface WelcomeScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-full flex flex-col justify-between p-6 bg-gradient-to-b from-[#121218] via-[#0B0B0E] to-[#050507] text-white">
      <div className="flex flex-col items-center text-center mt-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-medium mb-4 shadow-[0_0_15px_rgba(212,175,55,0.15)]">
          <Crown className="w-3.5 h-3.5" />
          <span>Executive Member Spa Club</span>
        </div>

        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#F3E5AB] via-[#D4AF37] to-[#8A6A0B] p-[2px] shadow-[0_0_25px_rgba(212,175,55,0.3)] mb-4">
          <div className="w-full h-full bg-[#0E0E13] rounded-2xl flex flex-col items-center justify-center">
            <span className="text-xl font-black text-[#D4AF37] tracking-widest">TBC</span>
            <span className="text-[8px] font-mono tracking-widest text-zinc-400">CAR SPA</span>
          </div>
        </div>

        <h1 className="text-xl font-bold text-amber-200 mb-1">
          ยินดีต้อนรับสู่ TBC CAR SPA
        </h1>
        <p className="text-xs text-zinc-400 max-w-[280px] leading-relaxed">
          ยกระดับการดูแลรถยนต์ระดับพรีเมียม สัมผัสประสบการณ์สปาและการเคลือบสีขั้นสูง
        </p>
      </div>

      <div className="my-6 space-y-2.5">
        <div className="p-3 rounded-2xl bg-[#14141C] border border-[#D4AF37]/20 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-zinc-200">จองคิวรับบริการสะดวกรวดเร็ว</h3>
            <p className="text-[10px] text-zinc-400">เลือกบริการ วัน เวลา และสาขาที่ต้องการได้ทันที</p>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-[#14141C] border border-[#D4AF37]/20 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-zinc-200">สะสมแต้มแลกสิทธิพิเศษ VIP</h3>
            <p className="text-[10px] text-zinc-400">ทุกการใช้จ่ายรับแต้ม TBC Points แลกรับบริการฟรี</p>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-[#14141C] border border-[#D4AF37]/20 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-zinc-200">เช็กสถานะการล้างรถ Real-time</h3>
            <p className="text-[10px] text-zinc-400">ติดตามขั้นตอนการทำงาน 5 สเต็ปอย่างแม่นยำ</p>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-2">
        <button
          onClick={() => onNavigate('register')}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#B8860B] text-black font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.4)] active:scale-95 transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>สมัครสมาชิกใหม่ (รับฟรี 500 แต้ม)</span>
          <ArrowRight className="w-4 h-4 ml-auto" />
        </button>

        <button
          onClick={() => onNavigate('login')}
          className="w-full py-3.5 px-4 rounded-xl bg-[#06C755] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#05b34c] shadow-lg active:scale-95 transition-all cursor-pointer"
        >
          <LogIn className="w-4 h-4" />
          <span>เข้าสู่ระบบด้วย LINE (LIFF)</span>
          <ArrowRight className="w-4 h-4 ml-auto" />
        </button>

        <p className="text-[10px] text-center text-zinc-500 font-mono">
          เชื่อมต่อ Prisma ORM + LINE LIFF • ปลอดภัยด้วย PDPA Standard
        </p>
      </div>
    </div>
  );
};
