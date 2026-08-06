import React from 'react';
import { Calendar, Clock, Info } from 'lucide-react';

interface DateTimeSelectorProps {
  selectedDate: string;
  onChangeDate: (date: string) => void;
  selectedTime: string;
  onChangeTime: (time: string) => void;
  timeSlots: string[];
  lang: 'th' | 'en';
  labels: {
    stepTitle: string;
    dateLabel: string;
    timeLabel: string;
    timeSelected: string;
    capacityNote: string;
  };
}

export const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
  selectedDate,
  onChangeDate,
  selectedTime,
  onChangeTime,
  timeSlots,
  lang,
  labels,
}) => {
  return (
    <div className="space-y-3">
      <label className="text-xs font-bold text-amber-200 uppercase tracking-wider block">
        {labels.stepTitle}
      </label>

      <div className="p-4 rounded-[24px] bg-[#15161A] border border-white/5 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-300 font-medium flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-zinc-400" />
            <span>{labels.dateLabel}</span>
          </span>
          <span className="text-[10px] text-zinc-400 font-mono">{selectedDate}</span>
        </div>

        <input
          type="date"
          value={selectedDate}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => onChangeDate(e.target.value)}
          className="w-full bg-[#1A1C20] border border-white/10 rounded-[16px] px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
        />
      </div>

      <div className="p-4 rounded-[24px] bg-[#15161A] border border-white/5 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-300 font-medium flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-zinc-400" />
            <span>{labels.timeLabel}</span>
          </span>
          <span className="text-[10px] text-zinc-400 font-mono">
            {labels.timeSelected}: {selectedTime}
            {lang === 'th' ? ' น.' : ''}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {timeSlots.map((time) => {
            const isSelected = selectedTime === time;
            return (
              <button
                key={time}
                type="button"
                onClick={() => onChangeTime(time)}
                className={`py-2.5 rounded-[12px] text-[11px] font-medium border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#1A1C20] text-[#D4AF37] border-[#D4AF37]'
                    : 'bg-[#1A1C20] border-white/5 text-zinc-400 hover:border-white/20'
                }`}
              >
                {time}
                {lang === 'th' ? ' น.' : ''}
              </button>
            );
          })}
        </div>

        <div className="p-2 rounded-xl bg-black/40 border border-zinc-800 flex items-center gap-1.5 text-[9px] text-zinc-400">
          <Info className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
          <span>{labels.capacityNote}</span>
        </div>
      </div>
    </div>
  );
};