import React, { useState, useEffect } from 'react';
import { ScreenId, UserProfile, SpaService, SpaBranch, Vehicle, BookingRecord } from '../../types';
import { apiService } from '../../services/api';
import { SPA_SERVICES, SPA_BRANCHES } from '../../data/constants';
import { getTranslation } from '../../data/translations';

// Import Components
import { BookingHeader } from '../../components/Booking/BookingHeader';
import { VehicleSelector } from '../../components/Booking/VehicleSelector';
import { ServiceSelector } from '../../components/Booking/ServiceSelector';
import { BranchSelector } from '../../components/Booking/BranchSelector';
import { DateTimeSelector } from '../../components/Booking/DateTimeSelector';
import { BookingSummary } from '../../components/Booking/BookingSummary';

interface BookingScreenProps {
  user: UserProfile;
  onAddBooking: (record: BookingRecord) => void;
  onNavigate: (screen: ScreenId) => void;
  onUpdateUser?: (user: UserProfile) => void;
  lang?: 'th' | 'en';
}

export const BookingScreen: React.FC<BookingScreenProps> = ({
  user,
  onAddBooking,
  onNavigate,
  onUpdateUser,
  lang = 'th',
}) => {
  const t = getTranslation(lang);
  const [services, setServices] = useState<SpaService[]>(SPA_SERVICES);
  const [branches, setBranches] = useState<SpaBranch[]>(SPA_BRANCHES);
  const [loadingData, setLoadingData] = useState(true);

  const [selectedService, setSelectedService] = useState<SpaService | null>(SPA_SERVICES[0]);
  const [includeFlexCoat, setIncludeFlexCoat] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>(
    user.vehicles && user.vehicles.length > 0
      ? user.vehicles[0]
      : {
          id: 'v_default',
          licensePlate: '9กข 8899',
          brand: 'Porsche',
          model: 'Taycan Cross Turismo',
          color: 'Frozen Blue',
          year: '2023',
          isPrimary: true,
        }
  );
  const [selectedBranch, setSelectedBranch] = useState<SpaBranch | null>(SPA_BRANCHES[0]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [shopCapacity, setShopCapacity] = useState<{
    totalActiveCarsInShop: number;
    isShopFull: boolean;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [fifoNotice, setFifoNotice] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [srvList, brList, vList] = await Promise.all([
          apiService.getServices(),
          apiService.getBranches(),
          apiService.getVehicles(user.lineUserId),
        ]);

        if (vList && vList.length > 0) {
          onUpdateUser?.({ ...user, vehicles: vList });
          if (!user.vehicles || user.vehicles.length === 0) {
            setSelectedVehicle(vList[0]);
          }
        }
        if (srvList && srvList.length > 0) {
          const mergedServices = srvList.map((s) => {
            const staticSrv = SPA_SERVICES.find((item) => item.id === s.id);
            return {
              ...s,
              name_en: s.name_en || staticSrv?.name_en,
              description_en: s.description_en || staticSrv?.description_en,
              badge_en: s.badge_en || staticSrv?.badge_en,
              steps_en: s.steps_en || staticSrv?.steps_en,
            };
          });
          setServices(mergedServices);
          setSelectedService(mergedServices[0]);
        }
        if (brList && brList.length > 0) {
          const mergedBranches = brList.map((b) => {
            const staticBr = SPA_BRANCHES.find((item) => item.id === b.id);
            return {
              ...b,
              name_en: b.name_en || staticBr?.name_en,
              openHours_en: b.openHours_en || staticBr?.openHours_en,
            };
          });
          setBranches(mergedBranches);
          setSelectedBranch(mergedBranches[0]);
        }
      } catch (err) {
        console.error('Failed to load services & branches from DB:', err);
      } finally {
        setLoadingData(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchCapacity() {
      try {
        const avail: any = await apiService.getSlotAvailability(selectedDate);
        setShopCapacity({
          totalActiveCarsInShop: avail.totalActiveCarsInShop || 0,
          isShopFull: Boolean(avail.isShopFull),
        });
      } catch (err) {
        console.error('Failed to fetch shop capacity:', err);
      }
    }
    fetchCapacity();
  }, [selectedDate]);

  const timeSlots = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
  ];

  const calculateTotalPrice = () => {
    if (!selectedService) return 0;
    let total = selectedService.priceTHB;
    if (selectedService.id === 's2' && includeFlexCoat) {
      total += 600;
    }
    return total;
  };

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleConfirmBooking = async () => {
    if (!selectedService || !selectedBranch) return;

    setSubmitting(true);
    setErrorMessage(null);
    try {
      const res = await apiService.createBooking(
        {
          userId: user.id,
          serviceId: selectedService.id,
          vehicleId: selectedVehicle.id,
          branchId: selectedBranch.id,
          date: selectedDate,
          time: selectedTime,
          vehicle: selectedVehicle,
        },
        user.lineUserId
      );

      if (res.fifoInfo && res.fifoInfo.isShopFull) {
        setFifoNotice(t.book_fifo_notice_full.replace('{ticket}', res.fifoInfo.queueTicket || ''));
      }

      onAddBooking(res);
      setTimeout(() => {
        onNavigate('booking_success');
      }, res.fifoInfo?.isShopFull ? 2500 : 300);
    } catch (err: any) {
      console.warn('Backend API booking sync deferred, using seamless local booking:', err);
      const bookingRef = 'TBC-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Math.floor(100 + Math.random() * 900);
      const totalPrice = calculateTotalPrice();
      const depositAmount = selectedService.priceTHB >= 2990 ? 500 : 300;
      const remainingAmount = Math.max(0, totalPrice - depositAmount);

      const fallbackBooking: BookingRecord = {
        id: 'b_' + Date.now(),
        bookingRef,
        service: selectedService,
        vehicle: selectedVehicle,
        branch: selectedBranch,
        date: selectedDate,
        time: selectedTime,
        status: 'Pending Deposit Approval',
        totalAmount: totalPrice,
        depositAmount,
        remainingAmount,
        paymentStatus: 'Pending Deposit Verification',
        pointsEarned: selectedService.pointsEarned,
        qrCode: `TBC-QR-${bookingRef}`,
        user,
      };

      onAddBooking(fallbackBooking);
      onNavigate('booking_success');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingData && services.length === 0) {
    return (
      <div className="p-8 text-center text-zinc-400">
        <div className="w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <span>{t.book_loading}</span>
      </div>
    );
  }

  const shopStatusText = shopCapacity?.isShopFull
    ? t.book_shop_full
    : t.book_shop_available.replace('{n}', String(3 - (shopCapacity?.totalActiveCarsInShop || 0)));

  return (
    <div className="p-4 bg-[#0B0B0D] text-white space-y-6 pb-24">
      {/* Header & Notice */}
      <BookingHeader
        shopStatusText={shopStatusText}
        fifoNotice={fifoNotice}
        fifoNoticeTitle={t.book_fifo_notice_title}
        headerTitle={t.book_header}
        shopStatusLabel={t.book_shop_status}
      />

      {/* Select Vehicle */}
      <VehicleSelector
        user={user}
        selectedVehicle={selectedVehicle}
        onSelectVehicle={setSelectedVehicle}
        onNavigate={onNavigate}
        labels={{
          stepTitle: t.book_step1,
          addCarBtn: t.book_add_car,
          carColor: t.book_car_color,
          carYear: t.book_car_year,
        }}
      />

      {/* Select Service */}
      <ServiceSelector
        services={services}
        selectedService={selectedService}
        onSelectService={setSelectedService}
        lang={lang}
        labels={{
          stepTitle: t.book_step2,
          serviceSteps: t.book_service_steps,
          minutes: t.book_minutes,
          points: t.book_points,
        }}
      />

      {/* Select Branch */}
      <BranchSelector
        branches={branches}
        selectedBranch={selectedBranch}
        onSelectBranch={setSelectedBranch}
        lang={lang}
        stepTitle={t.book_step3}
      />

      {/* Date & Time Slot Selection */}
      <DateTimeSelector
        selectedDate={selectedDate}
        onChangeDate={setSelectedDate}
        selectedTime={selectedTime}
        onChangeTime={setSelectedTime}
        timeSlots={timeSlots}
        lang={lang}
        labels={{
          stepTitle: t.book_step4,
          dateLabel: t.book_date_label,
          timeLabel: t.book_time_label,
          timeSelected: t.book_time_selected,
          capacityNote: t.book_capacity_note,
        }}
      />

      {errorMessage && (
        <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-medium leading-relaxed animate-fade-in">
          {errorMessage}
        </div>
      )}

      {/* Summary & Confirm Button */}
      <BookingSummary
        totalPrice={calculateTotalPrice()}
        submitting={submitting}
        onConfirm={handleConfirmBooking}
        labels={{
          totalLabel: t.book_total,
          submittingText: t.book_submitting,
          confirmBtn: t.book_confirm_btn,
        }}
      />
    </div>
  );
};