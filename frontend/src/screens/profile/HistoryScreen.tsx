import React, { useState, useEffect } from 'react';
import { ScreenId, BookingRecord, UserProfile } from '../../types';
import { History, FileText, Sparkles, X, Printer, Calendar } from 'lucide-react';
import { apiService } from '../../services/api';
import { SPA_SERVICES, SPA_BRANCHES } from '../../data/constants';
import { getTranslation } from '../../data/translations';

interface HistoryScreenProps {
  user?: UserProfile;
  bookings: BookingRecord[];
  onNavigate: (screen: ScreenId) => void;
  lang?: 'th' | 'en';
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ user, bookings, onNavigate, lang = 'th' }) => {
  const t = getTranslation(lang);
  const [selectedReceipt, setSelectedReceipt] = useState<BookingRecord | null>(null);
  const [dbBookings, setDbBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserBookings() {
      setLoading(true);
      try {
        const lineUserId = user?.lineUserId || '';
        const list = await apiService.getBookings(lineUserId);
        setDbBookings(list);
      } catch (err) {
        console.error('Failed to fetch user history from DB:', err);
      } finally {
        setLoading(false);
      }
    }
    loadUserBookings();
  }, [user?.lineUserId]);

  const allRecords = dbBookings.length > 0 ? dbBookings : bookings;

  const getServiceName = (srv?: any) => {
    if (!srv) return '';
    if (lang === 'en') {
      const staticSrv = SPA_SERVICES.find((item) => item.id === srv.id);
      return srv.name_en || staticSrv?.name_en || srv.name;
    }
    return srv.name;
  };

  const getBranchName = (br?: any) => {
    if (!br) return '';
    if (lang === 'en') {
      const staticBr = SPA_BRANCHES.find((item) => item.id === br.id);
      return br.name_en || staticBr?.name_en || br.name;
    }
    return br.name;
  };

  return (
    <div className="p-4 bg-[#0B0B0D] text-white space-y-6 pb-24">
      <div className="p-4 rounded-[24px] bg-[#15161A] border border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <History className="w-5 h-5 text-[#D4AF37]" />
          <div>
            <h2 className="text-xs font-bold text-amber-200">{t.history_header}</h2>
            <p className="text-[10px] text-zinc-400">{t.history_subhead}</p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-zinc-400 bg-white/5 px-2 py-1 rounded border border-white/10">
          {allRecords.length} {t.history_count}
        </span>
      </div>

      {loading ? (
        <div className="p-8 text-center text-zinc-400">
          <div className="w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <span className="text-xs">{t.history_loading}</span>
        </div>
      ) : allRecords.length === 0 ? (
        <div className="p-8 rounded-[24px] bg-[#1A1C20] border border-white/5 text-center space-y-3 my-4">
          <History className="w-10 h-10 text-zinc-500 mx-auto" />
          <div>
            <h3 className="text-xs font-bold text-zinc-300">{t.history_empty_title}</h3>
            <p className="text-[11px] text-zinc-500 mt-0.5">{t.history_empty_desc}</p>
          </div>
          <button
            onClick={() => onNavigate('booking')}
            className="btn-primary w-full mt-4"
          >
            {t.history_book_btn}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {allRecords.map((rec) => (
            <div
              key={rec.id}
              onClick={() => setSelectedReceipt(rec)}
              className="p-4 rounded-[24px] bg-[#1A1C20] border border-white/5 hover:border-white/20 cursor-pointer transition-all space-y-3 group"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <span className="text-[10px] font-mono text-zinc-400 font-bold">
                  {rec.bookingRef}
                </span>
                <span
                  className={`text-[9px] px-2 py-0.5 rounded-full font-semibold border ${
                    rec.status === 'Completed'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}
                >
                  {rec.status === 'Completed' ? t.history_status_done : t.history_status_inprogress}
                </span>
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                    {getServiceName(rec.service)}
                  </h3>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    {rec.vehicle?.brand} {rec.vehicle?.model} <span className="font-mono text-zinc-500 ml-1">({rec.vehicle?.licensePlate})</span>
                  </p>
                  <p className="text-[10px] text-zinc-500 mt-1">
                    {getBranchName(rec.branch)} • {rec.date}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm font-bold font-mono text-white">
                    ฿{rec.totalAmount ? rec.totalAmount.toLocaleString() : '0'}
                  </span>
                  <p className="text-[9px] text-emerald-400 flex items-center justify-end gap-0.5 mt-0.5">
                    <Sparkles className="w-3 h-3 text-[#D4AF37]" /> +{rec.pointsEarned} pts
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <span className="text-[10px] text-zinc-500 flex items-center gap-1 group-hover:text-zinc-300 transition-colors">
                  <FileText className="w-3.5 h-3.5" /> {t.history_view_receipt}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* E-Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#15161A] border border-white/10 rounded-[32px] p-6 relative shadow-2xl space-y-4">
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#1A1C20] text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center pb-4 border-b border-white/5">
              <div className="w-10 h-10 rounded-[12px] bg-[#1A1C20] border border-white/5 text-[#D4AF37] font-bold flex items-center justify-center text-sm mx-auto mb-2">
                TBC
              </div>
              <h3 className="text-xs font-bold text-white tracking-widest">E-RECEIPT & SERVICE CERTIFICATE</h3>
              <p className="text-[10px] text-zinc-500 font-mono mt-1">TBC CAR SPA THAILAND</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>{t.receipt_order_no}</span>
                <span className="font-mono text-white font-bold">{selectedReceipt.bookingRef}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>{t.receipt_date}</span>
                <span className="text-white font-mono">{selectedReceipt.date}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>{t.receipt_plate}</span>
                <span className="text-white font-mono">{selectedReceipt.vehicle?.licensePlate}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>{t.receipt_service}</span>
                <span className="text-white font-medium">{getServiceName(selectedReceipt.service)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>{t.receipt_branch}</span>
                <span className="text-white">{getBranchName(selectedReceipt.branch)}</span>
              </div>

              <div className="pt-3 border-t border-white/5 flex justify-between font-bold text-sm">
                <span>{t.receipt_total}</span>
                <span className="text-[#D4AF37] font-mono">฿{selectedReceipt.totalAmount ? selectedReceipt.totalAmount.toLocaleString() : '0'}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedReceipt(null)}
              className="btn-primary w-full mt-4"
            >
              <Printer className="w-4 h-4 mr-2" />
              <span>{t.receipt_print}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
