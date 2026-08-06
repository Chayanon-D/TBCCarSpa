import React from 'react';
import { Play, CheckCircle2, FastForward, Check } from 'lucide-react';
import { BookingRecord } from '../../types';

interface BookingCardProps {
  item: BookingRecord;
  queueNum: number;
  showActions?: boolean;
  onUpdateStep?: (booking: BookingRecord, nextStep: number) => void;
  onCompleteService?: (booking: BookingRecord) => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  item,
  queueNum,
  showActions = true,
  onUpdateStep,
  onCompleteService,
}) => {
  const isCompleted = item.status === 'Completed';
  const isInProgress = item.status === 'In Progress';
  const currentStep = item.carLiveStatus?.currentStep || (isInProgress ? 2 : 1);
  const customerDisplayName =
    item.user?.lineDisplayName ||
    (item.user?.firstName ? `${item.user.firstName} ${item.user.lastName}` : 'คุณสมาชิก LINE');

  const getStepLabel = (step: number) => {
    switch (step) {
      case 1:
        return 'Step 1/5: กำลังรอ (Queued)';
      case 2:
        return 'Step 2/5: กำลังล้าง (Washing)';
      case 3:
        return 'Step 3/5: กำลังขัด & เคลือบ (Polishing)';
      case 4:
        return 'Step 4/5: ตรวจเช็ก QC (Inspection)';
      case 5:
        return 'Step 5/5: เสร็จแล้ว พร้อมรับรถ (Ready)';
      default:
        return 'Waiting';
    }
  };

  const getNextStepBtnText = () => {
    if (isCompleted) return 'เสร็จสมบูรณ์แล้ว';
    if (!isInProgress && currentStep <= 1) return 'เริ่มบริการ (Step 1 → 2)';
    if (currentStep === 2) return 'อัปเดตเป็น Step 3 (ขัด & เคลือบ)';
    if (currentStep === 3) return 'อัปเดตเป็น Step 4 (ตรวจ QC)';
    if (currentStep === 4) return 'อัปเดตเป็น Step 5 (พร้อมรับรถ)';
    return '✅ ครบ 5 ขั้นตอนแล้ว (Ready)';
  };

  const getProgressWidthClass = () => {
    if (isCompleted) return 'bg-emerald-500 w-full';
    switch (currentStep) {
      case 1:
        return 'bg-zinc-600 w-1/5';
      case 2:
        return 'bg-[#D4AF37] w-2/5';
      case 3:
        return 'bg-[#D4AF37] w-3/5';
      case 4:
        return 'bg-[#D4AF37] w-4/5';
      case 5:
        return 'bg-emerald-400 w-full';
      default:
        return 'bg-zinc-600 w-1/5';
    }
  };

  const nextStepNumber = currentStep < 2 ? 2 : currentStep + 1;
  const canAdvanceStep = !isCompleted && currentStep < 5;

  return (
    <div className="p-4 rounded-3xl bg-[#13131A] border border-zinc-800 hover:border-[#D4AF37]/50 transition-all space-y-3 shadow-lg">
      {/* Line 1: Queue Num, Car Info, License Plate, Booking Ref */}
      <div className="flex items-start justify-between pb-2.5 border-b border-zinc-800/80">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#D4AF37] text-black font-extrabold flex items-center justify-center text-sm shadow">
            {queueNum}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-white">
                {item.vehicle?.brand} {item.vehicle?.model}
              </h3>
              <span className="font-mono font-bold text-xs text-amber-300 bg-black/60 px-2 py-0.5 rounded border border-zinc-800">
                {item.vehicle?.licensePlate}
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 mt-0.5">
              ลูกค้า: <strong className="text-zinc-200">{customerDisplayName}</strong>
            </p>
          </div>
        </div>

        <span className="font-mono font-bold text-[10px] text-amber-300 bg-black/60 px-2.5 py-1 rounded-xl border border-zinc-800">
          {item.bookingRef}
        </span>
      </div>

      {/* Line 2: Service & Time Details */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-[10px] text-zinc-400 block">บริการที่เลือก:</span>
          <span className="font-bold text-white block truncate">{item.service?.name}</span>
        </div>

        <div>
          <span className="text-[10px] text-zinc-400 block">วัน / เวลานัด:</span>
          <span className="font-bold text-amber-300 font-mono block">
            {item.date ? `${item.date} ` : ''}{item.time} น.
          </span>
        </div>
      </div>

      {/* Current Status Bar */}
      <div className="space-y-1 pt-1">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-zinc-400">สถานะขั้นตอนล้าง:</span>
          <span
            className={`font-mono font-bold px-2 py-0.5 rounded border ${
              isCompleted
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                : currentStep === 5
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : isInProgress
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                : 'bg-zinc-800 text-zinc-400 border-zinc-700'
            }`}
          >
            {isCompleted ? 'ส่งมอบเรียบร้อย' : getStepLabel(currentStep)}
          </span>
        </div>

        <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700">
          <div className={`h-full transition-all duration-500 ${getProgressWidthClass()}`} />
        </div>
      </div>

      {/* Action Buttons - Only rendered on live queue tab */}
      {showActions && (
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={() => onUpdateStep?.(item, nextStepNumber)}
            disabled={!canAdvanceStep}
            className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              !canAdvanceStep
                ? 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed opacity-60'
                : !isInProgress
                ? 'bg-[#00B087] hover:bg-[#009673] text-black shadow-md active:scale-95'
                : 'bg-amber-500 hover:bg-amber-400 text-black shadow-md active:scale-95'
            }`}
          >
            {!isInProgress ? (
              <Play className="w-3.5 h-3.5 fill-current" />
            ) : canAdvanceStep ? (
              <FastForward className="w-3.5 h-3.5" />
            ) : (
              <Check className="w-3.5 h-3.5" />
            )}
            <span>{getNextStepBtnText()}</span>
          </button>

          <button
            onClick={() => onCompleteService?.(item)}
            disabled={isCompleted}
            className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isCompleted
                ? 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed'
                : currentStep >= 5
                ? 'bg-[#00B087] hover:bg-[#009673] text-black font-extrabold shadow-lg animate-pulse'
                : 'bg-[#00B087]/15 text-[#00B087] border border-[#00B087]/50 hover:bg-[#00B087]/25'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isCompleted ? 'ส่งมอบเรียบร้อย' : 'เสร็จงาน (ส่งมอบรถ)'}</span>
          </button>
        </div>
      )}
    </div>
  );
};