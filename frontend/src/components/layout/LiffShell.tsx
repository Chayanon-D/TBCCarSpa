import React from 'react';
import { ScreenId, UserProfile } from '../../types';
import {
  Home,
  Calendar,
  Car,
  History,
  User,
  Bell,
  ChevronLeft,
  X,
  Sparkles,
  Crown,
} from 'lucide-react';
import { isShopOwnerAdmin } from '../../utils/adminAuth';
import { getTranslation, LangType } from '../../data/translations';

interface LiffShellProps {
  user?: UserProfile;
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  unreadCount: number;
  children: React.ReactNode;
  lang?: LangType;
}

export const LiffShell: React.FC<LiffShellProps> = ({
  user,
  currentScreen,
  onNavigate,
  unreadCount,
  children,
  lang = 'th',
}) => {
  const isAdmin = isShopOwnerAdmin(user?.lineUserId);
  const t = getTranslation(lang);

  // Screens where bottom nav should be visible
  const showNav = [
    'home',
    'booking',
    'car_status',
    'profile',
    'vehicles',
    'history',
    'notifications',
    'settings',
    'admin',
  ].includes(currentScreen);

  // Screens that have back button in LIFF header
  const showBackButton = ![
    'splash',
    'welcome',
    'home',
  ].includes(currentScreen);

  const getHeaderTitle = (screen: ScreenId) => {
    switch (screen) {
      case 'login':
        return t.header_login;
      case 'register':
        return t.header_register;
      case 'reg_success':
        return t.header_reg_success;
      case 'home':
        return t.header_home;
      case 'booking':
        return t.header_booking;
      case 'booking_success':
        return t.header_booking_success;
      case 'profile':
        return t.header_profile;
      case 'vehicles':
        return t.header_vehicles;
      case 'history':
        return t.header_history;
      case 'car_status':
        return t.header_car_status;
      case 'notifications':
        return t.header_notifications;
      case 'settings':
        return t.header_settings;
      case 'admin':
        return t.header_admin;
      default:
        return 'TBC CAR SPA';
    }
  };

  const handleBack = () => {
    if (currentScreen === 'booking_success' || currentScreen === 'reg_success') {
      onNavigate('home');
    } else if (currentScreen === 'booking' || currentScreen === 'admin') {
      onNavigate('home');
    } else if (currentScreen === 'register' || currentScreen === 'login') {
      onNavigate('welcome');
    } else {
      onNavigate('home');
    }
  };

  return (
    <div className="relative flex flex-col w-full max-w-[390px] h-[844px] max-h-screen bg-[#0D0D0F] overflow-hidden select-none border border-white/5 rounded-3xl">
      {/* LINE LIFF Header Bar */}
      {currentScreen !== 'splash' && (
        <div className="bg-[#1A1B1F] border-b border-[#2B2D31] px-4 py-3 flex items-center justify-between text-white z-30 shrink-0">
          <div className="flex items-center gap-2">
            {showBackButton ? (
              <button
                onClick={handleBack}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-800 text-[#D81E25] transition-colors cursor-pointer"
                aria-label="Back"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-[#1A1C20] flex items-center justify-center font-bold text-white text-xs border border-white/5">
                TBC
              </div>
            )}
            <div>
              <h2 className="text-xs font-semibold text-zinc-100 truncate max-w-[170px]">
                {getHeaderTitle(currentScreen)}
              </h2>
              <div className="flex items-center gap-1 text-[10px] text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>{t.connecting}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Quick Admin Dashboard Access for Authorized Shop Owner */}
            {isAdmin && (
              <button
                onClick={() => onNavigate('admin')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  currentScreen === 'admin'
                    ? 'bg-[#D81E25] text-white'
                    : 'bg-[#1A1B1F] text-[#BDBDBD] border border-[#2B2D31]'
                }`}
                title="Shop Owner Admin Dashboard"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>{t.admin}</span>
              </button>
            )}

            {/* Notifications Button */}
            <button
              onClick={() => onNavigate('notifications')}
              className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#2B2D31] text-[#BDBDBD] hover:text-[#D81E25] transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 border border-[#15161A]"></span>
              )}
            </button>

            {/* Close LIFF Icon */}
            <button
              onClick={() => onNavigate('home')}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#2B2D31] text-[#BDBDBD] hover:text-white transition-colors cursor-pointer"
              title="Close LIFF App"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto relative w-full scrollbar-thin">
        {children}
      </div>

      {/* Floating Quick Action Button (Book Appointment) */}
      {showNav && currentScreen !== 'booking' && currentScreen !== 'admin' && (
        <button
          onClick={() => onNavigate('booking')}
          className="absolute bottom-[92px] right-4 z-40 w-14 h-14 rounded-full bg-[#D81E25] text-white flex items-center justify-center font-bold shadow-[0_4px_20px_rgba(216,30,37,0.3)] transition-transform active:scale-95 cursor-pointer"
          title="Quick Booking"
        >
          <Sparkles className="w-6 h-6" />
        </button>
      )}

      {/* Floating Bottom Navigation Bar */}
      {showNav && (
        <div className="absolute bottom-6 left-4 right-4 z-30">
          <nav className="bg-[#1A1B1F]/80 backdrop-blur-xl border border-[#2B2D31] rounded-[32px] px-2 py-2 flex justify-around items-center text-white shadow-xl">
          {[
            { id: 'home', icon: Home, label: t.home },
            { id: 'booking', icon: Calendar, label: t.booking },
            { id: 'car_status', icon: Car, label: t.car_status },
            { id: 'history', icon: History, label: t.history },
            { id: 'profile', icon: User, label: t.profile },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as ScreenId)}
              className={`flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all cursor-pointer relative ${
                currentScreen === item.id ? 'text-[#D81E25]' : 'text-[#BDBDBD] hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5 mb-1" strokeWidth={currentScreen === item.id ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
          </nav>
        </div>
      )}

      {/* Home Bar Indicator (iOS style) */}
      <div className="bg-transparent pb-2 pt-1 flex justify-center z-40 shrink-0 absolute bottom-0 w-full">
        <div className="w-32 h-1 bg-white/20 rounded-full" />
      </div>
    </div>
  );
};
