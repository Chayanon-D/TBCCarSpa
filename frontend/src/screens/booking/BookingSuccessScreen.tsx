import React from 'react';
import { ScreenId, BookingRecord } from '../../types';
import { CheckCircle2, Calendar, MapPin, Car, Sparkles, Home, Activity } from 'lucide-react';
import { getTranslation } from '../../data/translations';

interface BookingSuccessScreenProps {
  booking: BookingRecord | null;
  onNavigate: (screen: ScreenId) => void;
  lang?: 'th' | 'en';
}

export const BookingSuccessScreen: React.FC<BookingSuccessScreenProps> = ({
  booking,
  onNavigate,
  lang = 'th',
}) => {
  const t = getTranslation(lang);
  const refCode = booking?.bookingRef || 'BK-2026-8819';
  const totalAmount = booking?.totalAmount || 0;

  return (
    <div className="min-h-full flex flex-col justify-between p-6 bg-[#0B0B0D] text-white">
      <div className="flex flex-col items-center text-center mt-6">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 mb-3">
          {t.success_confirmed_badge}
        </span>

        <h1 className="text-2xl font-bold text-white">
          {t.success_title}
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          {t.success_desc}
        </p>
      </div>

      <div className="my-8 p-6 rounded-[24px] bg-[#15161A] border border-white/5 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{t.success_booking_ref}</span>
            <p className="text-lg font-mono font-bold text-white mt-1">{refCode}</p>
          </div>
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium">
            Confirmed Queue
          </span>
        </div>

        <div className="space-y-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-zinc-500">
              <Car className="w-4 h-4" /> {t.success_car_label}
            </span>
            <span className="font-bold text-white font-mono">
              {booking?.vehicle?.brand} {booking?.vehicle?.model} <span className="text-zinc-400 ml-1">({booking?.vehicle?.licensePlate})</span>
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-zinc-500">
              <Sparkles className="w-4 h-4" /> {t.success_service_label}
            </span>
            <span className="font-medium text-white truncate max-w-[180px]">
              {booking?.service?.name || 'TBC Royal Signature Wash'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-zinc-500">
              <MapPin className="w-4 h-4" /> {t.success_branch_label}
            </span>
            <span className="font-medium text-white">
              {booking?.branch?.name || 'Main Branch'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-zinc-500">
              <Calendar className="w-4 h-4" /> {t.success_datetime_label}
            </span>
            <span className="font-bold text-white font-mono">
              {booking?.date || '04 Aug 2026'} <span className="text-zinc-500 mx-1">@</span> {booking?.time || '09:00'}
            </span>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-sm">
            <span className="text-zinc-400">{t.success_pay_label}</span>
            <span className="font-mono text-[#D4AF37] font-bold text-lg">฿{totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <button
          onClick={() => onNavigate('car_status')}
          className="btn-primary w-full"
        >
          <Activity className="w-5 h-5 mr-2" />
          <span>{t.success_track_btn}</span>
        </button>

        <button
          onClick={() => onNavigate('home')}
          className="btn-secondary w-full"
        >
          <Home className="w-5 h-5 mr-2" />
          <span>{t.success_home_btn}</span>
        </button>
      </div>
    </div>
  );
};
