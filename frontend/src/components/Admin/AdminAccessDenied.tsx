import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { ScreenId } from '../../types';

interface AdminAccessDeniedProps {
  onNavigate: (screen: ScreenId) => void;
}

export const AdminAccessDenied: React.FC<AdminAccessDeniedProps> = ({ onNavigate }) => {
  return (
    <div className="p-6 bg-[#0A0A0E] text-white min-h-full flex flex-col items-center justify-center text-center space-y-5 pb-20">
      <div className="w-20 h-20 rounded-full bg-red-950/50 border-2 border-red-500/40 p-3 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.3)]">
        <ShieldAlert className="w-10 h-10 text-red-500 animate-pulse" />
      </div>

      <div className="space-y-1">
        <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-red-400 bg-red-950/80 px-3 py-1 rounded-full border border-red-800">
          403 FORBIDDEN • IAM SECURITY GUARD
        </span>
        <h2 className="text-lg font-bold text-white mt-2">
          ปฏิเสธการเข้าถึง (Access Denied)
        </h2>
        <p className="text-xs text-zinc-400 max-w-xs leading-relaxed">
          เฉพาะบัญชี LINE เจ้าของร้านที่ระบุไว้ในไฟล์ <code className="text-amber-300 font-mono">.env</code> เท่านั้น
        </p>
      </div>

      <button
        onClick={() => onNavigate('home')}
        className="w-full py-3.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
      >
        <span>กลับสู่หน้าหลักสำหรับลูกค้า (Return to Home)</span>
      </button>
    </div>
  );
};