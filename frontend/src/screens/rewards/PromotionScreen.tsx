import React, { useState, useEffect } from 'react';
import { ScreenId, PromotionCoupon } from '../../types';
import { Tag, Check, Copy } from 'lucide-react';
import { apiService } from '../../services/api';
import { getTranslation } from '../../data/translations';

interface PromotionScreenProps {
  onNavigate: (screen: ScreenId) => void;
  lang?: 'th' | 'en';
}

export const PromotionScreen: React.FC<PromotionScreenProps> = ({ onNavigate, lang = 'th' }) => {
  const t = getTranslation(lang);
  const [coupons, setCoupons] = useState<PromotionCoupon[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    async function loadPromos() {
      try {
        const promoList = await apiService.getPromotions();
        setCoupons(promoList);
      } catch (err) {
        console.error('Failed to load promotions from DB:', err);
      }
    }
    loadPromos();
  }, []);

  const handleClaim = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isClaimed: true } : c))
    );
  };

  const handleCopy = (code: string) => {
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="p-4 bg-[#0A0A0E] text-white space-y-4 pb-20">
      <div className="p-5 rounded-3xl bg-gradient-to-r from-[#2A1E0D] via-[#1A1610] to-[#0D0D12] border border-[#D4AF37]/40 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <Tag className="w-5 h-5 text-[#D4AF37]" />
          <h2 className="text-xs font-bold text-amber-200 uppercase tracking-wider">SPECIAL PROMOTIONS</h2>
        </div>
        <h1 className="text-lg font-extrabold text-amber-200">
          {t.promo_title}
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          {t.promo_desc}
        </p>
      </div>

      <div className="space-y-3">
        {coupons.map((c) => (
          <div
            key={c.id}
            className="p-4 rounded-2xl bg-[#13131A] border border-zinc-800 hover:border-[#D4AF37]/40 transition-all space-y-3 relative overflow-hidden"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[9px] font-bold uppercase text-black bg-gradient-to-r from-[#F3E5AB] to-[#D4AF37] px-2 py-0.5 rounded shadow">
                  {c.discountBadge}
                </span>
                <h3 className="text-xs font-bold text-white mt-1.5">{c.title}</h3>
                <p className="text-[10px] text-zinc-400 mt-0.5">{c.description}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs">
              <span className="text-[10px] text-zinc-500 font-mono">
                {t.promo_expires} {c.validUntil}
              </span>

              {c.isClaimed ? (
                <button
                  onClick={() => handleCopy(c.code)}
                  className="px-3 py-1.5 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] font-mono font-bold text-xs flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
                >
                  {copiedCode === c.code ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{t.promo_copied}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{t.promo_code} {c.code}</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => handleClaim(c.id)}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#F3E5AB] to-[#D4AF37] text-black font-bold text-xs shadow active:scale-95 transition-all cursor-pointer"
                >
                  {t.promo_claim}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2">
        <button
          onClick={() => onNavigate('booking')}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#B8860B] text-black font-bold text-xs shadow-lg cursor-pointer"
        >
          ใช้คูปองสปาจองคิวทันที
        </button>
      </div>
    </div>
  );
};
