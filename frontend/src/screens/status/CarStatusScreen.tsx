import React, { useState, useEffect } from 'react';
import { ScreenId, CarLiveStatus, UserProfile } from '../../types';
import {
  Car,
  CheckCircle2,
  Clock,
  PhoneCall,
  Navigation,
  User,
  Calendar,
} from 'lucide-react';
import { apiService } from '../../services/api';
import { getTranslation } from '../../data/translations';

interface CarStatusScreenProps {
  user?: UserProfile;
  liveStatus: CarLiveStatus | null;
  onNavigate: (screen: ScreenId) => void;
  lang?: 'th' | 'en';
}

export const CarStatusScreen: React.FC<CarStatusScreenProps> = ({
  user,
  liveStatus,
  onNavigate,
  lang = 'th',
}) => {
  const t = getTranslation(lang);
  const [statusList, setStatusList] = useState<CarLiveStatus[]>(
    liveStatus ? [liveStatus] : []
  );

  useEffect(() => {
    async function fetchStatus() {
      try {
        const lineUserId = user?.lineUserId || '';
        const live = await apiService.getCarLiveStatus(lineUserId);
        if (Array.isArray(live)) {
          setStatusList(live.filter((item: any) => item && item.bookingId));
        } else if (live && live.bookingId) {
          setStatusList([live]);
        } else {
          setStatusList([]);
        }
      } catch (err) {
        setStatusList([]);
      }
    }
    fetchStatus();
  }, [user?.lineUserId]);

  const stagesList = [
    {
      step: 1,
      title: t.status_stage1_title,
      subtitle: t.status_stage1_sub,
      time: '15:10',
    },
    {
      step: 2,
      title: t.status_stage2_title,
      subtitle: t.status_stage2_sub,
      time: '15:30',
    },
    {
      step: 3,
      title: t.status_stage3_title,
      subtitle: t.status_stage3_sub,
      time: '16:10',
    },
    {
      step: 4,
      title: t.status_stage4_title,
      subtitle: t.status_stage4_sub,
      time: '16:35',
    },
    {
      step: 5,
      title: t.status_stage5_title,
      subtitle: t.status_stage5_sub,
      time: '16:45',
    },
  ];

  const getPercentage = (stepNum: number) => {
    switch (stepNum) {
      case 1:
        return 20;
      case 2:
        return 40;
      case 3:
        return 65;
      case 4:
        return 88;
      case 5:
        return 100;
      default:
        return 20;
    }
  };

  if (statusList.length === 0) {
    return (
      <div className="p-4 bg-[#0B0B0D] text-white min-h-full space-y-4 pb-20">
        <div className="p-4 rounded-[24px] bg-[#15161A] border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Car className="w-5 h-5 text-zinc-400" />
            <h2 className="text-sm font-bold text-white">
              {t.status_header}
            </h2>
          </div>
        </div>

        <div className="p-6 rounded-[24px] bg-[#1A1C20] border border-white/5 text-center space-y-4 my-8">
          <div className="w-16 h-16 rounded-full bg-[#15161A] border border-white/10 p-3 mx-auto flex items-center justify-center text-zinc-500">
            <Car className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">{t.status_no_car}</h3>
            <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto leading-relaxed">
              {t.status_no_car_desc}
            </p>
          </div>

          <button
            onClick={() => onNavigate('booking')}
            className="btn-primary w-full"
          >
            <Calendar className="w-5 h-5 mr-2" />
            <span>{t.status_book_btn}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-[#0B0B0D] text-white space-y-6 pb-24">
      {/* Top Header Card */}
      <div className="p-4 rounded-[24px] bg-[#15161A] border border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Car className="w-5 h-5 text-[#D4AF37]" />
          <div>
            <h2 className="text-sm font-bold text-white">{t.status_header}</h2>
            <p className="text-[10px] text-zinc-400">ติดตามสถานะรถยนต์ที่อยู่ระหว่างรับบริการสด</p>
          </div>
        </div>
        <span className="text-[10px] font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-1 rounded-full border border-[#D4AF37]/30 font-mono">
          {statusList.length} คันกำลังบริการ
        </span>
      </div>

      {/* Map Over All Cars in Progress */}
      {statusList.map((statusItem, idx) => {
        const currentStep = statusItem.currentStep || 1;
        const pct = getPercentage(currentStep);

        return (
          <div
            key={statusItem.bookingId || idx}
            className="p-5 rounded-[24px] bg-[#15161A] border border-[#D4AF37]/40 space-y-5 shadow-2xl relative overflow-hidden"
          >
            {/* Top Badge: Car Number */}
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#D4AF37] text-black font-extrabold flex items-center justify-center text-xs">
                  {idx + 1}
                </span>
                <h3 className="text-xs font-bold text-white">
                  {statusItem.vehicle?.brand} {statusItem.vehicle?.model}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs text-amber-300 bg-black/60 px-2.5 py-1 rounded-lg border border-zinc-800">
                  {statusItem.vehicle?.licensePlate}
                </span>
                {statusItem.bookingRef && (
                  <span className="font-mono text-[9px] text-zinc-400 bg-white/5 px-2 py-1 rounded">
                    {statusItem.bookingRef}
                  </span>
                )}
              </div>
            </div>

            {/* Service & Bay Summary */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-zinc-400 block">{t.status_service_label}:</span>
                <strong className="text-white block truncate">{statusItem.serviceName}</strong>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-zinc-400 block">ตำแหน่งช่องล้าง:</span>
                <span className="font-mono text-[#D4AF37] font-bold block">{statusItem.bayNumber || 'Bay 01'}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2 pt-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-zinc-400">{t.status_progress}</span>
                <span className="text-[#D4AF37] font-bold font-mono">{pct}%</span>
              </div>

              <div className="w-full h-2.5 bg-[#1A1C20] rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-[#F3E5AB] to-[#D4AF37] rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>

              <p className="text-[10px] text-zinc-400 flex items-center justify-between pt-1">
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <Clock className="w-3.5 h-3.5 text-[#D4AF37]" /> {t.status_est_finish}: {statusItem.estimatedFinishTime || '16:30'}
                </span>
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <User className="w-3.5 h-3.5 text-zinc-500" /> {statusItem.technicianName || 'Master Detailer Team'}
                </span>
              </p>
            </div>

            {/* 5 Horizontal Steps Track */}
            <div className="p-4 rounded-[20px] bg-[#1A1C20] border border-white/5 space-y-4">
              <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                {t.status_timeline}
              </h4>

              <div className="relative">
                {/* Background Track */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-white/5 -translate-y-1/2 rounded-full" />
                
                {/* Active Track */}
                <div 
                  className="absolute top-1/2 left-0 h-1 bg-[#D4AF37] -translate-y-1/2 rounded-full transition-all duration-500"
                  style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
                />

                <div className="relative flex justify-between">
                  {[1, 2, 3, 4, 5].map((s) => {
                    const isDone = s < currentStep;
                    const isCurrent = s === currentStep;
                    return (
                      <div key={s} className="flex flex-col items-center gap-2">
                        <div 
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold z-10 transition-all ${
                            isDone 
                              ? 'bg-[#D4AF37] text-black' 
                              : isCurrent
                              ? 'bg-[#15161A] border-2 border-[#D4AF37] text-[#D4AF37]'
                              : 'bg-[#1A1C20] border border-white/10 text-zinc-600'
                          }`}
                        >
                          {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : s}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Current Stage Card */}
              <div className="p-3 rounded-[14px] bg-[#15161A] border border-white/5">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-bold text-white">
                    {stagesList[currentStep - 1]?.title}
                  </h4>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {stagesList[currentStep - 1]?.time}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  {stagesList[currentStep - 1]?.subtitle}
                </p>
              </div>
            </div>
          </div>
        );
      })}

      <div className="grid grid-cols-2 gap-3 pt-2">
        <button className="btn-secondary text-xs h-[48px]">
          <PhoneCall className="w-4 h-4 mr-2 text-zinc-400" />
          <span>{t.status_call_staff}</span>
        </button>

        <button className="btn-secondary text-xs h-[48px]">
          <Navigation className="w-4 h-4 mr-2 text-zinc-400" />
          <span>{t.status_directions}</span>
        </button>
      </div>
    </div>
  );
};
