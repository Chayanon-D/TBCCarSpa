import React, { useState, useEffect } from 'react';
import { ScreenId, UserProfile, PointTransaction, RewardItem } from '../../types';
import { Gift, Sparkles, ArrowUpRight, ArrowDownLeft, Check, QrCode, X } from 'lucide-react';
import { apiService } from '../../services/api';
import { getTranslation } from '../../data/translations';

interface PointSystemScreenProps {
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  onNavigate: (screen: ScreenId) => void;
  lang?: 'th' | 'en';
}

export const PointSystemScreen: React.FC<PointSystemScreenProps> = ({
  user,
  onUpdateUser,
  lang = 'th',
}) => {
  const t = getTranslation(lang);
  const [activeTab, setActiveTab] = useState<'rewards' | 'history'>('rewards');
  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [pointHistory, setPointHistory] = useState<PointTransaction[]>([]);
  const [redeemedReward, setRedeemedReward] = useState<RewardItem | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [rList, hList] = await Promise.all([
          apiService.getRewards(),
          apiService.getPointHistory(user.id),
        ]);
        setRewards(rList);
        setPointHistory(hList);
      } catch (err) {
        console.error('Failed to fetch rewards & point history from DB:', err);
      }
    }
    loadData();
  }, [user.id]);

  const handleRedeem = async (reward: RewardItem) => {
    if (user.points < reward.ptsRequired) {
      alert(t.pts_insufficient);
      return;
    }

    try {
      const result = await apiService.redeemReward(user.id, reward.id);
      if (result.success) {
        onUpdateUser(result.user);
        setRedeemedReward(reward);
      }
    } catch (err) {
      console.error('Redeem failed:', err);
      // Fallback
      const updatedUser = { ...user, points: user.points - reward.ptsRequired };
      onUpdateUser(updatedUser);
      setRedeemedReward(reward);
    }
  };

  return (
    <div className="p-4 bg-[#0A0A0E] text-white space-y-4 pb-20">
      <div className="p-5 rounded-3xl bg-gradient-to-br from-[#262013] via-[#171720] to-[#0D0D12] border border-[#D4AF37]/40 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/20">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="text-xs font-bold text-amber-200 uppercase tracking-wider">TBC REWARDS & POINTS</h2>
          </div>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 font-semibold">
            {user.memberLevel || 'Gold VIP'}
          </span>
        </div>

        <div className="my-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest">{t.pts_balance}</p>
            <h1 className="text-3xl font-black text-amber-200 tracking-tight flex items-baseline gap-1 mt-0.5">
              <span>{user.points ? user.points.toLocaleString() : '1,250'}</span>
              <span className="text-xs font-normal text-zinc-400">PTS</span>
            </h1>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F3E5AB] to-[#D4AF37] text-black font-extrabold flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        <div className="space-y-1.5 pt-2 border-t border-[#D4AF37]/15">
          <div className="flex justify-between text-[10px]">
            <span className="text-zinc-400">{t.pts_next_level} Platinum Elite</span>
            <span className="text-[#D4AF37] font-mono">2,450 / 5,000 pts</span>
          </div>
          <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden p-0.5 border border-zinc-700">
            <div className="h-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#AA7C11] rounded-full w-[49%]" />
          </div>
          <p className="text-[9px] text-zinc-500">{t.pts_need_more.replace('{n}', '2,550')}</p>
        </div>
      </div>

      <div className="flex bg-[#13131A] p-1 rounded-2xl border border-zinc-800">
        <button
          onClick={() => setActiveTab('rewards')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'rewards'
              ? 'bg-gradient-to-r from-[#F3E5AB] to-[#D4AF37] text-black shadow'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          {t.pts_tab_rewards}
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'history'
              ? 'bg-gradient-to-r from-[#F3E5AB] to-[#D4AF37] text-black shadow'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          {t.pts_tab_history}
        </button>
      </div>

      {activeTab === 'rewards' ? (
        <div className="space-y-3">
          {rewards.map((r) => {
            const canRedeem = user.points >= r.ptsRequired;
            return (
              <div
                key={r.id}
                className="p-3.5 rounded-2xl bg-[#13131A] border border-zinc-800 flex items-center justify-between gap-3 hover:border-[#D4AF37]/40 transition-all"
              >
                <div className="flex-1 min-w-0">
                  <span className="text-[8px] uppercase font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/30">
                    {r.category}
                  </span>
                  <h4 className="text-xs font-bold text-white mt-1">{r.title}</h4>
                  <p className="text-[10px] text-zinc-400 mt-0.5">{r.description}</p>
                  <p className="text-xs font-bold font-mono text-amber-200 mt-1.5 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{r.ptsRequired.toLocaleString()} PTS</span>
                  </p>
                </div>

                <button
                  onClick={() => handleRedeem(r)}
                  disabled={!canRedeem}
                  className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                    canRedeem
                      ? 'bg-gradient-to-r from-[#F3E5AB] to-[#D4AF37] text-black shadow-md active:scale-95'
                      : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  }`}
                >
                  {canRedeem ? t.pts_redeem_btn : (lang === 'en' ? 'Low PTS' : 'แต้มไม่พอ')}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {pointHistory.map((pt) => (
            <div
              key={pt.id}
              className="p-3 rounded-2xl bg-[#13131A] border border-zinc-800/80 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                    pt.type === 'earn'
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : 'bg-red-500/15 text-red-400'
                  }`}
                >
                  {pt.type === 'earn' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{pt.title}</h4>
                  <p className="text-[10px] text-zinc-400">{pt.date} • {pt.category}</p>
                </div>
              </div>

              <span
                className={`text-xs font-mono font-bold ${
                  pt.type === 'earn' ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {pt.type === 'earn' ? '+' : ''}{pt.amount} PTS
              </span>
            </div>
          ))}
        </div>
      )}

      {redeemedReward && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-[#121218] border border-[#D4AF37] rounded-3xl p-5 text-center relative shadow-2xl">
            <button
              onClick={() => setRedeemedReward(null)}
              className="absolute top-3 right-3 p-1 rounded-full bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2 border border-emerald-500/40">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>

            <h3 className="text-sm font-bold text-amber-200">แลกรับของรางวัลสำเร็จ!</h3>
            <p className="text-xs text-zinc-300 font-medium mt-1">{redeemedReward.title}</p>
            <p className="text-[10px] text-zinc-400 mt-0.5">ใช้แต้ม {redeemedReward.ptsRequired} pts เรียบร้อยแล้ว</p>

            <div className="my-4 p-3 bg-white rounded-2xl">
              <QrCode className="w-32 h-32 text-black mx-auto" />
              <p className="text-xs font-mono font-bold text-black mt-1">
                {redeemedReward.code || 'RW-TBC-2026-X8'}
              </p>
            </div>

            <button
              onClick={() => setRedeemedReward(null)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#F3E5AB] to-[#D4AF37] text-black font-bold text-xs cursor-pointer"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
