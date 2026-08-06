import React from 'react';

interface AdminStatsProps {
  liveQueueCount: number;
  inProgressCount: number;
  completedCount: number;
}

export const AdminStats: React.FC<AdminStatsProps> = ({
  liveQueueCount,
  inProgressCount,
  completedCount,
}) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="p-3 rounded-2xl bg-[#13131A] border border-zinc-800 space-y-1">
        <span className="text-[9px] font-bold text-zinc-400 tracking-wider block">TODAY'S QUEUE</span>
        <p className="text-base font-black text-amber-200 font-mono">
          {liveQueueCount} <span className="text-[10px] font-normal text-zinc-400">/ 4 Cars</span>
        </p>
        <span className="text-[9px] text-emerald-400 block font-mono">
          🟢 ว่างอีก {Math.max(0, 3 - inProgressCount)} คิว
        </span>
      </div>

      <div className="p-3 rounded-2xl bg-[#13131A] border border-zinc-800 space-y-1">
        <span className="text-[9px] font-bold text-zinc-400 tracking-wider block">IN SERVICE</span>
        <p className="text-base font-black text-emerald-400 font-mono">
          {inProgressCount} <span className="text-[10px] font-normal text-zinc-300">กำลังทำ</span>
        </p>
        <span className="text-[9px] text-zinc-400 block font-mono">รอรับรถ {liveQueueCount} คัน</span>
      </div>

      <div className="p-3 rounded-2xl bg-[#13131A] border border-zinc-800 space-y-1">
        <span className="text-[9px] font-bold text-zinc-400 tracking-wider block">DONE TODAY</span>
        <p className="text-base font-black text-white font-mono">
          {completedCount} <span className="text-[10px] font-normal text-zinc-400">คัน</span>
        </p>
        <span className="text-[9px] text-zinc-400 block font-mono">ส่งมอบเรียบร้อย</span>
      </div>
    </div>
  );
};