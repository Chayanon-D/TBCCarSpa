import React from 'react';
import { Calendar, Flame } from 'lucide-react';

interface BookingHeaderProps {
  shopStatusText: string;
  fifoNotice: string | null;
  fifoNoticeTitle: string;
  headerTitle: string;
  shopStatusLabel: string;
}

export const BookingHeader: React.FC<BookingHeaderProps> = ({
  shopStatusText,
  fifoNotice,
  fifoNoticeTitle,
  headerTitle,
  shopStatusLabel,
}) => {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-[24px] bg-[#15161A] border border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-[#D4AF37]" />
          <div>
            <h2 className="text-xs font-bold text-amber-200">{headerTitle}</h2>
            <p className="text-[10px] text-zinc-400">
              {shopStatusLabel}: {shopStatusText}
            </p>
          </div>
        </div>
      </div>

      {fifoNotice && (
        <div className="p-3.5 rounded-xl bg-amber-950/80 border border-amber-500/50 text-amber-200 text-xs font-bold space-y-1 animate-pulse">
          <div className="flex items-center gap-1.5 text-amber-300">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>{fifoNoticeTitle}</span>
          </div>
          <p className="text-[11px] font-normal leading-relaxed">{fifoNotice}</p>
        </div>
      )}
    </div>
  );
};