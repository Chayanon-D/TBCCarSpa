import React, { useState, useEffect } from 'react';
import { ScreenId, NotificationItem } from '../../types';
import { Bell, CheckCheck, ChevronRight } from 'lucide-react';
import { apiService } from '../../services/api';
import { getTranslation } from '../../data/translations';

interface NotificationScreenProps {
  onNavigate: (screen: ScreenId) => void;
  lang?: 'th' | 'en';
}

export const NotificationScreen: React.FC<NotificationScreenProps> = ({ onNavigate, lang = 'th' }) => {
  const t = getTranslation(lang);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    async function loadNotifs() {
      try {
        const notifList = await apiService.getNotifications('');
        setNotifications(notifList);
      } catch (err) {
        console.error('Failed to load notifications from DB:', err);
      }
    }
    loadNotifs();
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="p-4 bg-[#0A0A0E] text-white space-y-4 pb-20">
      <div className="p-3.5 rounded-2xl bg-[#14141C] border border-[#D4AF37]/30 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Bell className="w-5 h-5 text-[#D4AF37]" />
          <div>
            <h2 className="text-xs font-bold text-amber-200">{t.notif_header}</h2>
            <p className="text-[10px] text-zinc-400">{t.notif_desc}</p>
          </div>
        </div>

        <button
          onClick={markAllRead}
          className="text-[10px] text-[#D4AF37] hover:underline flex items-center gap-1 font-medium cursor-pointer"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          <span>{t.notif_read_all}</span>
        </button>
      </div>

      <div className="space-y-2.5">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => {
              if (n.type === 'status') onNavigate('car_status');
              if (n.type === 'booking') onNavigate('history');
              if (n.type === 'promo') onNavigate('promotions');
            }}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
              !n.read
                ? 'bg-[#181610] border-[#D4AF37]/50 shadow-[0_0_12px_rgba(212,175,55,0.1)]'
                : 'bg-[#13131A] border-zinc-800 opacity-80'
            }`}
          >
            <div className="flex items-start justify-between">
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                {!n.read && <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />}
                <span>{n.title}</span>
              </h3>
              <span className="text-[9px] font-mono text-zinc-500">{n.time}</span>
            </div>

            <p className="text-[11px] text-zinc-300 mt-1 leading-relaxed">{n.message}</p>

            <div className="mt-2 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[10px] text-[#D4AF37]">
              <span>{t.notif_view_details}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
