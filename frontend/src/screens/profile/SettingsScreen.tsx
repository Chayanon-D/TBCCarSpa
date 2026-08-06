import React from 'react';
import { ScreenId, UserProfile } from '../../types';
import { Settings, Globe, Moon, ShieldCheck, LogOut, ChevronRight, Check, Crown, LayoutDashboard } from 'lucide-react';
import { useLiff } from '../../hooks/useLiff';
import { isShopOwnerAdmin } from '../../utils/adminAuth';
import { getTranslation } from '../../data/translations';

interface SettingsScreenProps {
  user: UserProfile;
  lang: 'th' | 'en';
  onToggleLang: () => void;
  onNavigate: (screen: ScreenId) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  user,
  lang,
  onToggleLang,
  onNavigate,
}) => {
  const { logoutLine, isLiffApp } = useLiff();
  const isAdmin = isShopOwnerAdmin(user.lineUserId);
  const t = getTranslation(lang);

  const handleLogout = () => {
    if (isLiffApp) {
      logoutLine();
    } else {
      onNavigate('welcome');
    }
  };

  return (
    <div className="p-4 bg-[#0A0A0E] text-white space-y-4 pb-20">
      <div className="p-3.5 rounded-2xl bg-[#14141C] border border-[#D4AF37]/30 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Settings className="w-5 h-5 text-[#D4AF37]" />
          <div>
            <h2 className="text-xs font-bold text-amber-200">{t.settings_title}</h2>
            <p className="text-[10px] text-zinc-400">{t.settings_desc}</p>
          </div>
        </div>
      </div>

      {/* Admin / Shop Owner Access Section - Only visible if IAM Admin */}
      {isAdmin && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#1C180E] via-[#14141C] to-[#0A0A0E] border border-[#D4AF37]/50 shadow-[0_0_15px_rgba(212,175,55,0.15)] space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#D4AF37]">
              <Crown className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-200">{t.shop_owner_mode}</h3>
            </div>
            <span className="text-[9px] uppercase font-mono font-bold bg-[#D4AF37] text-black px-2 py-0.5 rounded">
              IAM AUTHORIZED
            </span>
          </div>
          <p className="text-[10px] text-zinc-400 leading-relaxed">
            {t.shop_owner_desc}
          </p>
          <button
            onClick={() => onNavigate('admin')}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#B8860B] text-black font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95 transition-all"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>{t.shop_owner_btn}</span>
            <ChevronRight className="w-4 h-4 ml-auto" />
          </button>
        </div>
      )}

      <div className="p-4 rounded-2xl bg-[#13131A] border border-zinc-800 space-y-3">
        <div className="flex items-center gap-2 text-[#D4AF37] pb-2 border-b border-zinc-800">
          <Globe className="w-4 h-4" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-200">{t.language}</h3>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => lang !== 'th' && onToggleLang()}
            className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
              lang === 'th'
                ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]'
                : 'bg-[#1A1A22] border-zinc-800 text-zinc-400'
            }`}
          >
            <span>🇹🇭 ภาษาไทย (TH)</span>
            {lang === 'th' && <Check className="w-4 h-4 text-[#D4AF37]" />}
          </button>

          <button
            onClick={() => lang !== 'en' && onToggleLang()}
            className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
              lang === 'en'
                ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]'
                : 'bg-[#1A1A22] border-zinc-800 text-zinc-400'
            }`}
          >
            <span>🇬🇧 English (EN)</span>
            {lang === 'en' && <Check className="w-4 h-4 text-[#D4AF37]" />}
          </button>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-[#13131A] border border-zinc-800 space-y-2">
        <div className="flex items-center gap-2 text-[#D4AF37] pb-2 border-b border-zinc-800">
          <Moon className="w-4 h-4" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-200">{t.visual_theme}</h3>
        </div>

        <div className="p-3 rounded-xl bg-[#1A1A22] border border-[#D4AF37]/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-[#D4AF37] to-black border border-white/20" />
            <span className="text-xs font-bold text-amber-200">Luxury Black & Gold Theme</span>
          </div>
          <span className="text-[9px] bg-[#D4AF37] text-black font-bold px-2 py-0.5 rounded">{t.active}</span>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-[#13131A] border border-zinc-800 space-y-2">
        <div className="flex items-center gap-2 text-[#D4AF37] pb-2 border-b border-zinc-800">
          <ShieldCheck className="w-4 h-4" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-200">{t.policies}</h3>
        </div>

        <button
          onClick={() => alert(t.pdpa_alert)}
          className="w-full py-2.5 flex items-center justify-between text-xs text-zinc-300 hover:text-white cursor-pointer"
        >
          <span>{t.pdpa_title}</span>
          <ChevronRight className="w-4 h-4 text-zinc-500" />
        </button>
      </div>

      <div className="space-y-2 pt-2">
        <button
          onClick={handleLogout}
          className="w-full py-3.5 px-4 rounded-xl bg-red-950/40 hover:bg-red-900/40 border border-red-800/60 text-red-400 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>{t.logout}</span>
        </button>
      </div>
    </div>
  );
};
