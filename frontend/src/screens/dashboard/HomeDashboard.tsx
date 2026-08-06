import React from 'react';
import { ScreenId, UserProfile, CarLiveStatus } from '../../types';
import {
  Sparkles,
  Activity,
  History,
  Settings,
  ChevronRight,
  Shield,
  Car,
  Calendar,
} from 'lucide-react';
import { getTranslation } from '../../data/translations';

interface HomeDashboardProps {
  user: UserProfile;
  liveStatus: CarLiveStatus | null;
  onNavigate: (screen: ScreenId) => void;
  lang?: 'th' | 'en';
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  user,
  liveStatus,
  onNavigate,
  lang = 'th',
}) => {
  const t = getTranslation(lang);
  const primaryVehicle =
    (user.vehicles && user.vehicles.find((v) => v.isPrimary)) ||
    (user.vehicles && user.vehicles[0]);

  const vehicleCount = user.vehicles?.length || 0;

  const menuItems = [
    {
      id: 'booking',
      name: t.menu_booking,
      icon: Sparkles,
      screen: 'booking' as ScreenId,
      badge: t.menu_booking_badge,
      pulse: false,
    },
    {
      id: 'status',
      name: t.menu_status,
      icon: Activity,
      screen: 'car_status' as ScreenId,
      badge: 'LIVE',
      pulse: true,
    },
    {
      id: 'history',
      name: t.menu_history,
      icon: History,
      screen: 'history' as ScreenId,
      badge: '',
      pulse: false,
    },
    {
      id: 'vehicles',
      name: t.menu_vehicles,
      icon: Car,
      screen: 'vehicles' as ScreenId,
      badge: `${vehicleCount} ${t.menu_vehicles_badge}`,
      pulse: false,
    },
    {
      id: 'profile_info',
      name: t.menu_profile,
      icon: Shield,
      screen: 'profile' as ScreenId,
      badge: '',
      pulse: false,
    },
    {
      id: 'settings',
      name: t.menu_settings,
      icon: Settings,
      screen: 'settings' as ScreenId,
      badge: '',
      pulse: false,
    },
  ];

  return (
    <div className="p-4 bg-[#0B0B0D] text-white space-y-6 pb-24">
      {/* Customer Profile Card - Matching Screenshot 1 */}
      <div className="relative p-6 rounded-[24px] bg-[#15161A] border border-white/5 overflow-hidden">

        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-[16px] bg-[#1A1C20] border border-white/10 text-white font-extrabold flex items-center justify-center text-sm">
              TBC
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-zinc-400 font-bold">{t.vip_customer}</span>
              </div>
              <p className="text-[11px] text-zinc-500 font-mono mt-0.5">ID: {user.memberId || 'TBC-8899-VIP'}</p>
            </div>
          </div>

          <span className="text-[10px] font-bold text-zinc-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            {t.member_title}
          </span>
        </div>

        <div className="pt-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>{t.hello} {user.firstName} {user.lastName}</span>
              <Shield className="w-4 h-4 text-[#D4AF37]" />
            </h3>

            <div className="mt-1 space-y-1">
              {user.vehicles && user.vehicles.length > 0 ? (
                user.vehicles.map((v) => (
                  <p key={v.id} className="text-xs text-zinc-300 font-mono flex items-center gap-1.5">
                    <span>🚘</span>
                    <strong className="text-white">{v.brand} {v.model}</strong>
                    <span className="text-[#D4AF37]">({v.licensePlate})</span>
                    {v.isPrimary && (
                      <span className="text-[8px] bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 px-1 py-0.2 rounded font-semibold">
                        คันหลัก
                      </span>
                    )}
                  </p>
                ))
              ) : (
                <p className="text-xs text-zinc-400 font-mono">🚘 {t.no_vehicle}</p>
              )}
            </div>
          </div>

          <div className="text-right shrink-0">
            <p className="text-[10px] text-zinc-500">{t.services_used}</p>
            <p className="text-xl font-bold text-white font-mono">
              {user.usageCount || 0} <span className="text-xs font-normal text-zinc-400">{t.times}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Live Car Status Section - Matching Screenshot 1 */}
      <div
        onClick={() => onNavigate('car_status')}
        className="p-5 rounded-[24px] bg-[#1A1C20] border border-white/5 cursor-pointer hover:border-white/20 transition-all group"
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
            <span className="text-sm font-bold text-white">{t.spa_car_status}</span>
          </div>
          <span className="text-xs text-zinc-500 group-hover:text-zinc-300 transition-colors flex items-center gap-1">
            {t.view_details} <ChevronRight className="w-4 h-4" />
          </span>
        </div>

        {liveStatus ? (
          <div className="mt-4 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#15161A] overflow-hidden shrink-0 border border-white/5">
              <img
                src={liveStatus.photoProgressUrl || 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&q=80&w=600'}
                alt="Car progress"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-bold text-white truncate">
                  {liveStatus.vehicle?.brand} {liveStatus.vehicle?.model}
                </h4>
                <span className="text-xs font-mono font-bold text-zinc-400">
                  {liveStatus.vehicle?.licensePlate}
                </span>
              </div>
              <p className="text-[11px] text-[#D4AF37] font-bold truncate">
                {lang === 'en' ? 'Step' : 'ขั้นตอนที่'} {liveStatus.currentStep}/5: {liveStatus.stages?.[liveStatus.currentStep - 1]?.title || 'เสร็จแล้ว พร้อมรับรถ'}
              </p>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                {t.estimated_finish}: {liveStatus.estimatedFinishTime}
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-4 p-4 rounded-[16px] bg-[#15161A] border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Car className="w-6 h-6 text-zinc-500" />
              <div>
                <h4 className="text-sm font-bold text-zinc-300">{t.no_active_service}</h4>
                <p className="text-[11px] text-zinc-500 mt-0.5">{t.book_now_desc}</p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate('booking');
              }}
              className="px-4 py-2 rounded-xl bg-[#1A1C20] text-white text-xs font-bold border border-white/10 hover:border-white/20 shrink-0"
            >
              {t.btn_book_now}
            </button>
          </div>
        )}
      </div>

      {/* Main Menu Grid (6 Buttons) - Matching Screenshot 1 */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
          {t.main_menu}
        </h3>

        <div className="grid grid-cols-3 gap-3">
          {menuItems.map((item) => {
            const IconComp = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.screen)}
                className="relative flex flex-col items-center justify-center p-4 rounded-[24px] bg-[#1A1C20] border border-white/5 hover:border-white/20 transition-all active:scale-95 cursor-pointer group min-h-[100px]"
              >
                {item.badge && (
                  <span
                    className={`absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      item.pulse
                        ? 'bg-[#D4AF37] text-black font-bold'
                        : 'bg-[#15161A] text-zinc-400 border border-white/5'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                <div className="w-12 h-12 rounded-[16px] bg-[#15161A] text-zinc-400 flex items-center justify-center mb-2 transition-colors border border-white/5 group-hover:text-white">
                  <IconComp className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-medium text-zinc-400 text-center line-clamp-1 group-hover:text-white">
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
