import React from 'react';
import { ScreenId, UserProfile } from '../../types';
import { Sparkles, QrCode, ArrowRight, Crown, CheckCircle } from 'lucide-react';

interface RegSuccessScreenProps {
  user: UserProfile;
  onNavigate: (screen: ScreenId) => void;
}

export const RegSuccessScreen: React.FC<RegSuccessScreenProps> = ({
  user,
  onNavigate,
}) => {
  return (
    <div className="min-h-full flex flex-col justify-between p-6 bg-gradient-to-b from-[#121218] via-[#0A0A0E] to-[#050507] text-white">
      <div className="flex flex-col items-center text-center mt-2">
        <div className="w-14 h-14 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] mb-3 shadow-[0_0_20px_rgba(212,175,55,0.3)]">
          <CheckCircle className="w-8 h-8" />
        </div>

        <span className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-[#D4AF37]/30 mb-1">
          Welcome Gold VIP Member
        </span>

        <h1 className="text-xl font-bold text-amber-200">
          สมัครสมาชิกสำเร็จ!
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          ยินดีต้อนรับคุณ <span className="text-white font-medium">{user.firstName} {user.lastName}</span>
        </p>
      </div>

      <div className="my-4 p-5 rounded-3xl bg-gradient-to-br from-[#231E12] via-[#14141A] to-[#0A0A0D] border border-[#D4AF37]/40 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/20">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#F3E5AB] to-[#D4AF37] text-black font-bold flex items-center justify-center text-xs">
              TBC
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#D4AF37]">TBC EXECUTIVE SPA</h3>
              <p className="text-[9px] text-zinc-400 font-mono">GOLD VIP MEMBER</p>
            </div>
          </div>
          <Crown className="w-5 h-5 text-[#D4AF37]" />
        </div>

        <div className="my-4 flex flex-col items-center justify-center text-center">
          <div className="p-3 bg-white rounded-2xl shadow-xl mb-2">
            <div className="w-32 h-32 bg-zinc-900 rounded-xl flex flex-col items-center justify-center text-white p-2 relative">
              <QrCode className="w-24 h-24 text-black" />
              <div className="absolute inset-0 bg-white/95 rounded-xl flex flex-col items-center justify-center text-black p-2">
                <div className="grid grid-cols-6 gap-1 w-full h-full p-1 border-2 border-black rounded">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div
                      key={i}
                      className={`${
                        (i * 7) % 3 === 0 || i % 5 === 0 ? 'bg-black' : 'bg-transparent'
                      } rounded-xs`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <p className="text-[11px] font-mono font-bold text-[#D4AF37] tracking-widest">
            {user.memberId}
          </p>
          <p className="text-[9px] text-zinc-400">สแกนที่หน้าเคาน์เตอร์เพื่อรับบริการและสะสมแต้ม</p>
        </div>

        <div className="pt-3 border-t border-[#D4AF37]/20 flex justify-between items-center text-xs">
          <div>
            <p className="text-[9px] text-zinc-400">ทะเบียนรถหลัก</p>
            <p className="font-bold text-amber-300 font-mono">
              {user.vehicles[0]?.licensePlate || '9กข 8899'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[9px] text-zinc-400">คะแนนเริ่มต้น (Bonus)</p>
            <p className="font-bold text-emerald-400 flex items-center gap-1 justify-end">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              <span>+500 แต้ม</span>
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-2">
        <button
          onClick={() => onNavigate('home')}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#B8860B] text-black font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.4)] active:scale-95 transition-all cursor-pointer"
        >
          <span>ไปที่หน้าแรก (Home Dashboard)</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};
