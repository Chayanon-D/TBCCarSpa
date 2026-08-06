import { useState, useEffect } from 'react';
import { ScreenId, UserProfile, BookingRecord, CarLiveStatus } from './types';
import { useLiff } from './hooks/useLiff';
import { apiService } from './services/api';

// LINE LIFF Shell Layout
import { LiffShell } from './components/layout/LiffShell';

// Categorized Screen Views
import { SplashScreen } from './screens/auth/SplashScreen';
import { WelcomeScreen } from './screens/auth/WelcomeScreen';
import { LoginScreen } from './screens/auth/LoginScreen';
import { RegisterScreen } from './screens/auth/RegisterScreen';
import { RegSuccessScreen } from './screens/auth/RegSuccessScreen';
import { HomeDashboard } from './screens/dashboard/HomeDashboard';
import { BookingScreen } from './screens/booking/BookingScreen';
import { BookingSuccessScreen } from './screens/booking/BookingSuccessScreen';
import { CarStatusScreen } from './screens/status/CarStatusScreen';
import { PointSystemScreen } from './screens/rewards/PointSystemScreen';
import { PromotionScreen } from './screens/rewards/PromotionScreen';
import { ProfileScreen } from './screens/profile/ProfileScreen';
import { VehicleScreen } from './screens/profile/VehicleScreen';
import { HistoryScreen } from './screens/profile/HistoryScreen';
import { NotificationScreen } from './screens/profile/NotificationScreen';
import { SettingsScreen } from './screens/profile/SettingsScreen';
import { AdminDashboard } from './screens/admin/AdminDashboard';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('splash');
  const { dbUser, liffUser, setDbUser, loading } = useLiff();

  // Local state fallbacks with localStorage persistence
  const [bookings, setBookings] = useState<BookingRecord[]>(() => {
    try {
      const stored = localStorage.getItem('tbc_user_bookings');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [latestBooking, setLatestBooking] = useState<BookingRecord | null>(null);
  const [liveStatus, setLiveStatus] = useState<CarLiveStatus | null>(null);
  const [lang, setLang] = useState<'th' | 'en'>(() => {
    try {
      const stored = localStorage.getItem('tbc_lang');
      return (stored === 'th' || stored === 'en') ? stored : 'th';
    } catch {
      return 'th';
    }
  });

  const handleToggleLang = () => {
    setLang((prev) => {
      const next = prev === 'th' ? 'en' : 'th';
      try {
        localStorage.setItem('tbc_lang', next);
      } catch (e) {
        console.error('Failed to save language setting to localStorage:', e);
      }
      return next;
    });
  };

  const unreadCount = 0;

  // Use real LIFF User ID if available, avoiding hardcoded fallback mismatch
  const realLineUserId = dbUser?.lineUserId || liffUser?.userId;

  useEffect(() => {
    async function loadLiveStatus() {
      try {
        const status = await apiService.getCarLiveStatus(realLineUserId);
        setLiveStatus(status);
      } catch (err) {
        // Safe null handling when no live car status exists for this customer
        setLiveStatus(null);
      }
    }
    loadLiveStatus();
  }, [realLineUserId]);

  const user: UserProfile = dbUser || {
    id: 'usr_default',
    lineUserId: realLineUserId,
    lineDisplayName: liffUser?.displayName || 'คุณสมาชิก TBC CAR SPA',
    linePictureUrl: liffUser?.pictureUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    firstName: liffUser?.displayName?.split(' ')[0] || 'สมาชิก',
    lastName: liffUser?.displayName?.split(' ')[1] || 'TBC',
    phone: '',
    email: '',
    dob: '',
    province: 'กรุงเทพมหานคร',
    memberId: 'TBC-88992',
    memberLevel: 'Silver Member',
    points: 0,
    usageCount: 0,
    pdpaAccepted: true,
    vehicles: [], // Zero mock vehicles
  };

  const handleAddBooking = (record: BookingRecord) => {
    setBookings((prev) => {
      const next = [record, ...prev];
      try {
        localStorage.setItem('tbc_user_bookings', JSON.stringify(next));
      } catch (e) {
        console.error('Failed to cache bookings in localStorage:', e);
      }
      return next;
    });
    setLatestBooking(record);
    setDbUser((prev) =>
      prev
        ? {
            ...prev,
            points: prev.points + record.pointsEarned,
            usageCount: prev.usageCount + 1,
          }
        : user
    );
    // Refresh live status for this customer
    apiService.getCarLiveStatus(realLineUserId).then(setLiveStatus).catch(() => {});
  };

  const handleUpdateUser = (updated: UserProfile) => {
    setDbUser(updated);
  };

  const renderActiveScreen = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-zinc-400 p-8 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono">Initializing LINE LIFF & Loading DB...</p>
        </div>
      );
    }

    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onNavigate={setCurrentScreen} />;
      case 'welcome':
        return <WelcomeScreen onNavigate={setCurrentScreen} />;
      case 'login':
        return <LoginScreen user={user} onNavigate={setCurrentScreen} />;
      case 'register':
        return (
          <RegisterScreen
            user={user}
            onUpdateUser={handleUpdateUser}
            onNavigate={setCurrentScreen}
          />
        );
      case 'reg_success':
        return <RegSuccessScreen user={user} onNavigate={setCurrentScreen} />;
      case 'home':
        return (
          <HomeDashboard
            user={user}
            liveStatus={liveStatus}
            onNavigate={setCurrentScreen}
            lang={lang}
          />
        );
      case 'booking':
        return (
          <BookingScreen
            user={user}
            onAddBooking={handleAddBooking}
            onNavigate={setCurrentScreen}
            onUpdateUser={handleUpdateUser}
            lang={lang}
          />
        );
      case 'booking_success':
        return <BookingSuccessScreen booking={latestBooking} onNavigate={setCurrentScreen} lang={lang} />;
      case 'points':
        return (
          <PointSystemScreen
            user={user}
            onUpdateUser={handleUpdateUser}
            onNavigate={setCurrentScreen}
            lang={lang}
          />
        );
      case 'profile':
        return <ProfileScreen user={user} onNavigate={setCurrentScreen} lang={lang} />;
      case 'vehicles':
        return (
          <VehicleScreen
            user={user}
            onUpdateUser={handleUpdateUser}
            onNavigate={setCurrentScreen}
            lang={lang}
          />
        );
      case 'history':
        return <HistoryScreen user={user} bookings={bookings} onNavigate={setCurrentScreen} lang={lang} />;
      case 'promotions':
        return <PromotionScreen onNavigate={setCurrentScreen} lang={lang} />;
      case 'car_status':
        return (
          <CarStatusScreen
            user={user}
            liveStatus={liveStatus}
            onNavigate={setCurrentScreen}
            lang={lang}
          />
        );
      case 'notifications':
        return <NotificationScreen onNavigate={setCurrentScreen} lang={lang} />;
      case 'settings':
        return (
          <SettingsScreen
            user={user}
            lang={lang}
            onToggleLang={handleToggleLang}
            onNavigate={setCurrentScreen}
          />
        );
      case 'admin':
        return <AdminDashboard user={user} onNavigate={setCurrentScreen} />;
      default:
        return <HomeDashboard user={user} liveStatus={liveStatus} onNavigate={setCurrentScreen} lang={lang} />;
    }
  };

  return (
    <div className="w-full h-screen bg-[#0A0A0A] text-white font-sans overflow-hidden flex justify-center items-center">
      <LiffShell
        user={user}
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        unreadCount={unreadCount}
        lang={lang}
      >
        {renderActiveScreen()}
      </LiffShell>
    </div>
  );
}
