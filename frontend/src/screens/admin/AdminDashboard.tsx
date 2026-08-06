import React, { useState, useEffect } from 'react';
import { ScreenId, BookingRecord, AdminAnalytics, UserProfile } from '../../types';
import { Car, Search, Layers } from 'lucide-react';
import { apiService } from '../../services/api';
import { isShopOwnerAdmin } from '../../utils/adminAuth';

// Import Components
import { AdminAccessDenied } from '../../components/Admin/AdminAccessDenied';
import { AdminHeader } from '../../components/Admin/AdminHeader';
import { AdminStats } from '../../components/Admin/AdminStats';
import { AdminTabs, AdminTabType } from '../../components/Admin/AdminTabs';
import { BookingCard } from '../../components/Admin/BookingCard';

interface AdminDashboardProps {
  user: UserProfile;
  onNavigate: (screen: ScreenId) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onNavigate }) => {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [activeTab, setActiveTab] = useState<AdminTabType>('live');
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const isAuthorized = isShopOwnerAdmin(user.lineUserId);

  const loadAdminData = async (showLoading = true) => {
    if (!isAuthorized) {
      setAccessDenied(true);
      setLoading(false);
      return;
    }

    if (showLoading) setLoading(true);
    try {
      const [analyticsData, bookingsData] = await Promise.all([
        apiService.getAdminAnalytics(user.lineUserId),
        apiService.getBookings(user.lineUserId),
      ]);
      setAnalytics(analyticsData);
      setBookings(bookingsData);
      setAccessDenied(false);
    } catch (err: any) {
      console.error('Failed to load admin dashboard data:', err);
      if (err.message && err.message.includes('403')) {
        setAccessDenied(true);
      }
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData(true);
    const interval = setInterval(() => {
      loadAdminData(false);
    }, 5000);
    return () => clearInterval(interval);
  }, [user.lineUserId]);

  const handleUpdateStep = async (booking: BookingRecord, nextStep: number) => {
    try {
      if (booking.status !== 'In Progress' && booking.status !== 'Completed') {
        await apiService.updateBookingStatus(booking.id, 'In Progress', user.lineUserId);
      }
      await apiService.updateCarLiveStatus(
        {
          bookingId: booking.id,
          currentStep: nextStep,
          bayNumber: nextStep === 5 ? 'VIP Lounge' : 'Bay 01 (Detailing Zone)',
          technicianName: 'ทีมงาน Master Detailer',
          estimatedFinishTime: nextStep === 5 ? 'พร้อมส่งมอบรถ' : '17:00 น.',
        },
        user.lineUserId
      );
      setUpdateMessage(
        `⏩ อัปเดตสถานะรถทะเบียน ${booking.vehicle?.licensePlate || ''} เป็น Step ${nextStep} เรียบร้อยแล้ว`
      );
      setTimeout(() => setUpdateMessage(null), 3000);
      loadAdminData(false);
    } catch (err) {
      console.error('Failed to update service step:', err);
    }
  };

  const handleCompleteService = async (booking: BookingRecord) => {
    try {
      await apiService.updateBookingStatus(booking.id, 'Completed', user.lineUserId);
      await apiService.updateCarLiveStatus(
        {
          bookingId: booking.id,
          currentStep: 5,
          bayNumber: 'VIP Lounge',
          technicianName: 'ทีมงาน Master Detailer',
          estimatedFinishTime: 'ส่งมอบเรียบร้อยแล้ว',
        },
        user.lineUserId
      );
      setUpdateMessage(`☑️ ส่งมอบรถทะเบียน ${booking.vehicle?.licensePlate || ''} เรียบร้อยแล้ว`);
      setTimeout(() => setUpdateMessage(null), 3000);
      loadAdminData(false);
    } catch (err) {
      console.error('Failed to complete service:', err);
    }
  };

  if (accessDenied || !isAuthorized) {
    return <AdminAccessDenied onNavigate={onNavigate} />;
  }

  const inProgressBookings = bookings.filter((b) => b.status === 'In Progress');
  const completedBookings = bookings.filter((b) => b.status === 'Completed');
  const liveQueueBookings = bookings.filter((b) => b.status !== 'Completed');

  const filteredBookings = bookings.filter((b) => {
    const query = searchQuery.toLowerCase();
    const custName = (
      b.user?.lineDisplayName || `${b.user?.firstName || ''} ${b.user?.lastName || ''}`
    ).toLowerCase();
    return (
      b.bookingRef.toLowerCase().includes(query) ||
      (b.vehicle?.licensePlate && b.vehicle.licensePlate.toLowerCase().includes(query)) ||
      (b.vehicle?.brand && b.vehicle.brand.toLowerCase().includes(query)) ||
      (b.service?.name && b.service.name.toLowerCase().includes(query)) ||
      custName.includes(query)
    );
  });

  const displayBookings = (() => {
    switch (activeTab) {
      case 'all':
        return bookings;
      case 'search':
        return filteredBookings;
      case 'history':
        return completedBookings;
      case 'live':
      default:
        return liveQueueBookings;
    }
  })();

  return (
    <div className="p-4 bg-[#0A0A0E] text-white min-h-full space-y-4 pb-20">
      {/* Top Header Card */}
      <AdminHeader user={user} onNavigate={onNavigate} />

      {updateMessage && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between animate-fade-in">
          <span>{updateMessage}</span>
        </div>
      )}

      {/* 3 Stat Cards */}
      <AdminStats
        liveQueueCount={liveQueueBookings.length}
        inProgressCount={inProgressBookings.length}
        completedCount={completedBookings.length}
      />

      {/* Admin Tab Switcher */}
      <AdminTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalBookingsCount={bookings.length}
      />

      {/* Main Queue Management Section Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#D4AF37]" />
          <h2 className="text-xs font-black text-amber-200 uppercase tracking-wider">
            {activeTab === 'live'
              ? "การจัดการคิวงานวันปัจจุบัน (TODAY'S LIVE QUEUE)"
              : activeTab === 'all'
              ? 'การจองทั้งหมดในระบบ (ALL BOOKINGS)'
              : activeTab === 'search'
              ? 'ค้นหาและประวัติลูกค้า (CUSTOMER DIRECTORY)'
              : "ประวัติการเข้ารับบริการวันนี้ (TODAY'S COMPLETED HISTORY)"}
          </h2>
        </div>
        <span className="text-[10px] font-mono text-zinc-400">
          {displayBookings.length} รายการ
        </span>
      </div>

      {activeTab === 'search' && (
        <div className="relative mb-2">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="ค้นหาทะเบียนรถ / รหัสจอง / บริการ / ชื่อลูกค้า..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1A1A24] border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
      )}

      {loading ? (
        <div className="p-8 text-center text-zinc-400">
          <div className="w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <span className="text-xs">กำลังโหลดคิวงานจาก Database...</span>
        </div>
      ) : displayBookings.length === 0 ? (
        <div className="p-8 rounded-3xl bg-[#13131A] border border-zinc-800 text-center space-y-2">
          <Car className="w-8 h-8 text-zinc-600 mx-auto" />
          <h3 className="text-xs font-bold text-zinc-300">ไม่มีรายการการจองในหมวดหมู่นี้</h3>
          <p className="text-[11px] text-zinc-500">
            เมื่อมีลูกค้ากดจองคิว รายการจะแสดงบนแผงควบคุมแอดมินโดยอัตโนมัติ
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayBookings.map((item, index) => (
            <BookingCard
              key={item.id}
              item={item}
              queueNum={index + 1}
              showActions={activeTab === 'live'}
              onUpdateStep={handleUpdateStep}
              onCompleteService={handleCompleteService}
            />
          ))}
        </div>
      )}
    </div>
  );
};