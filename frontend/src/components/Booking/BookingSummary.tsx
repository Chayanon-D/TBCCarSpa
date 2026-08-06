import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface BookingSummaryProps {
  totalPrice: number;
  submitting: boolean;
  onConfirm: () => void;
  labels: {
    totalLabel: string;
    submittingText: string;
    confirmBtn: string;
  };
}

export const BookingSummary: React.FC<BookingSummaryProps> = ({
  totalPrice,
  submitting,
  onConfirm,
  labels,
}) => {
  return (
    <div className="p-5 rounded-[24px] bg-[#1A1C20] border border-white/5 space-y-4">
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <span className="text-sm font-medium text-zinc-300">{labels.totalLabel}</span>
        <span className="text-xl font-bold text-white">฿{totalPrice.toLocaleString()}</span>
      </div>

      <button onClick={onConfirm} disabled={submitting} className="btn-primary w-full disabled:opacity-50">
        {submitting ? (
          <span>{labels.submittingText}</span>
        ) : (
          <>
            <ShieldCheck className="w-5 h-5 mr-2" />
            <span>{labels.confirmBtn}</span>
          </>
        )}
      </button>
    </div>
  );
};