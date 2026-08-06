import React from 'react';
import { ScreenId, UserProfile } from '../../types';
import { ShieldCheck, Crown, Car, History, Settings, ChevronRight, Edit3 } from 'lucide-react';
import { getTranslation } from '../../data/translations';

interface ProfileScreenProps {
  user: UserProfile;
  onNavigate: (screen: ScreenId) => void;
  lang?: 'th' | 'en';
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, onNavigate, lang = 'th' }) => {
  const t = getTranslation(lang);

  return (
    <div className="p-4 bg-[#0B0B0D] text-white space-y-6 pb-24">
      {/* Profile Header Card */}
      <div className="p-6 rounded-[24px] bg-[#15161A] border border-white/5 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={user.linePictureUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}
              alt="Profile Avatar"
              className="w-16 h-16 rounded-[20px] object-cover border-2 border-white/10"
            />
            <span className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-[#1A1C20] flex items-center justify-center border border-white/5 text-[#D4AF37]">
              <Crown className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="flex-1 min-w-0 pl-2">
            <span className="text-[10px] font-bold text-zinc-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
              {user.memberLevel || 'Silver Member'}
            </span>
            <h2 className="text-sm font-bold text-white truncate mt-1">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-[11px] text-zinc-400 font-mono">ID: {user.memberId}</p>
            <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
              {user.phone ? `${user.phone} • ` : ''}{user.email || 'LINE Account'}
            </p>
          </div>
        </div>

        <div className="mt-5 pt-5 border-t border-white/5 grid grid-cols-2 gap-3 text-center text-xs">
          <div className="bg-[#1A1C20] p-3 rounded-[16px] border border-white/5">
            <span className="text-[10px] text-zinc-500 block mb-1">{t.profile_usage_count}</span>
            <span className="font-bold text-lg text-white">{user.usageCount || 0} <span className="text-[10px] text-zinc-500 font-normal">{t.times}</span></span>
          </div>
          <div className="bg-[#1A1C20] p-3 rounded-[16px] border border-white/5">
            <span className="text-[10px] text-zinc-500 block mb-1">{t.profile_vehicle_count}</span>
            <span className="font-bold text-lg text-white">{user.vehicles ? user.vehicles.length : 0} <span className="text-[10px] text-zinc-500 font-normal">{t.menu_vehicles_badge}</span></span>
          </div>
        </div>
      </div>

      {/* Account Actions Menu */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
          {t.account_mgmt}
        </h3>

        <div className="space-y-2">
          <button
            onClick={() => onNavigate('vehicles')}
            className="w-full p-4 rounded-[20px] bg-[#1A1C20] border border-white/5 hover:border-white/20 flex items-center justify-between text-sm text-zinc-300 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#15161A] flex items-center justify-center text-zinc-400">
                <Car className="w-4 h-4" />
              </div>
              <span className="font-medium">{t.garage_mgmt}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-600" />
          </button>

          <button
            onClick={() => onNavigate('history')}
            className="w-full p-4 rounded-[20px] bg-[#1A1C20] border border-white/5 hover:border-white/20 flex items-center justify-between text-sm text-zinc-300 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#15161A] flex items-center justify-center text-zinc-400">
                <History className="w-4 h-4" />
              </div>
              <span className="font-medium">{t.service_logs}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-600" />
          </button>

          <button
            onClick={() => onNavigate('register')}
            className="w-full p-4 rounded-[20px] bg-[#1A1C20] border border-white/5 hover:border-white/20 flex items-center justify-between text-sm text-zinc-300 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#15161A] flex items-center justify-center text-zinc-400">
                <Edit3 className="w-4 h-4" />
              </div>
              <span className="font-medium">{t.edit_profile}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-600" />
          </button>

          <button
            onClick={() => onNavigate('settings')}
            className="w-full p-4 rounded-[20px] bg-[#1A1C20] border border-white/5 hover:border-white/20 flex items-center justify-between text-sm text-zinc-300 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#15161A] flex items-center justify-center text-zinc-400">
                <Settings className="w-4 h-4" />
              </div>
              <span className="font-medium">{t.system_settings_notify}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-600" />
          </button>
        </div>
      </div>

      {/* Member Benefits */}
      <div className="p-5 rounded-[24px] bg-[#15161A] border border-white/5 space-y-3">
        <div className="flex items-center gap-2 text-white pb-3 border-b border-white/5">
          <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
          <h4 className="text-sm font-bold">{t.benefits_title}</h4>
        </div>
        <ul className="text-xs text-zinc-400 space-y-2 list-disc pl-5">
          <li>{t.benefit1}</li>
          <li>{t.benefit2}</li>
          <li>{t.benefit3}</li>
        </ul>
      </div>
    </div>
  );
};
