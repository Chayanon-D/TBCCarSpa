import React from 'react';
import { ArrowRightLeft } from 'lucide-react';
import { ScreenId, UserProfile } from '../../types';

interface AdminHeaderProps {
  user: UserProfile;
  onNavigate: (screen: ScreenId) => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ user, onNavigate }) => {
  return (
    <div className="p-4 rounded-3xl bg-[#13131A] border border-[#D4AF37]/40 flex items-center justify-between shadow-xl">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F3E5AB] via-[#D4AF37] to-[#8A6A0B] text-black font-extrabold flex items-center justify-center text-sm shadow-md">
          ADM
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-black text-amber-200">TBC Admin Control</h1>
            <span className="text-[9px] uppercase font-mono font-bold bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-500/30">
              LIVE
            </span>
          </div>
          <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
            LINE User ID: {user.lineUserId || 'U_ADMIN_TBC'}
          </p>
        </div>
      </div>

      <button
        onClick={() => onNavigate('home')}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all cursor-pointer"
      >
        <ArrowRightLeft className="w-3.5 h-3.5" />
        <span>User Mode</span>
      </button>
    </div>
  );
};