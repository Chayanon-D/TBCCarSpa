import React, { useState } from 'react';
import { ScreenId, UserProfile, Vehicle } from '../../types';
import { Car, Plus, Trash2, CheckCircle2, X, Star } from 'lucide-react';
import { apiService } from '../../services/api';
import { getTranslation } from '../../data/translations';

interface VehicleScreenProps {
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  onNavigate: (screen: ScreenId) => void;
  lang?: 'th' | 'en';
}

export const VehicleScreen: React.FC<VehicleScreenProps> = ({
  user,
  onUpdateUser,
  lang = 'th',
}) => {
  const t = getTranslation(lang);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    licensePlate: '',
    brand: '',
    model: '',
    color: '',
    year: '2024',
  });
  const [submitting, setSubmitting] = useState(false);

  React.useEffect(() => {
    async function loadUserVehicles() {
      try {
        const vList = await apiService.getVehicles(user.lineUserId);
        if (vList && vList.length > 0) {
          onUpdateUser({ ...user, vehicles: vList });
        }
      } catch (err) {
        console.error('Failed to fetch vehicles from DB:', err);
      }
    }
    loadUserVehicles();
  }, [user.lineUserId]);

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehicle.licensePlate || !newVehicle.brand || !newVehicle.model) return;

    setSubmitting(true);
    try {
      const added = await apiService.addVehicle(
        {
          userId: user.id,
          licensePlate: newVehicle.licensePlate,
          brand: newVehicle.brand,
          model: newVehicle.model,
          color: newVehicle.color || 'Black',
          year: newVehicle.year || '2024',
          isPrimary: (user.vehicles || []).length === 0,
        },
        user.lineUserId
      );

      const updatedUser = { ...user, vehicles: [...(user.vehicles || []), added] };
      onUpdateUser(updatedUser);
      setShowAddModal(false);
      setNewVehicle({ licensePlate: '', brand: '', model: '', color: '', year: '2024' });
    } catch (err) {
      console.error('Failed to add vehicle to DB:', err);
      // Fallback
      const added: Vehicle = {
        id: 'v_' + Date.now(),
        licensePlate: newVehicle.licensePlate,
        brand: newVehicle.brand,
        model: newVehicle.model,
        color: newVehicle.color || 'Black',
        year: newVehicle.year || '2024',
        isPrimary: (user.vehicles || []).length === 0,
      };
      const updatedUser = { ...user, vehicles: [...(user.vehicles || []), added] };
      onUpdateUser(updatedUser);
      setShowAddModal(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSetPrimary = (id: string) => {
    const updatedVehicles = (user.vehicles || []).map((v) => ({
      ...v,
      isPrimary: v.id === id,
    }));
    onUpdateUser({ ...user, vehicles: updatedVehicles });
  };

  const handleDeleteVehicle = async (id: string) => {
    if ((user.vehicles || []).length <= 1) {
      alert(t.garage_min_car);
      return;
    }
    try {
      await apiService.deleteVehicle(id, user.lineUserId);
    } catch (err) {
      console.error('Delete vehicle error:', err);
    }
    const updatedVehicles = (user.vehicles || []).filter((v) => v.id !== id);
    onUpdateUser({ ...user, vehicles: updatedVehicles });
  };

  return (
    <div className="p-4 bg-[#0A0A0E] text-white space-y-4 pb-20">
      <div className="p-3.5 rounded-2xl bg-[#14141C] border border-[#D4AF37]/30 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Car className="w-5 h-5 text-[#D4AF37]" />
          <div>
            <h2 className="text-xs font-bold text-amber-200">{t.garage_header}</h2>
            <p className="text-[10px] text-zinc-400">{t.garage_desc}</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#F3E5AB] to-[#D4AF37] text-black font-bold text-xs flex items-center gap-1 shadow active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.garage_add_car}</span>
        </button>
      </div>

      <div className="space-y-3">
        {(user.vehicles || []).map((v) => (
          <div
            key={v.id}
            className={`p-4 rounded-2xl border transition-all ${
              v.isPrimary
                ? 'bg-[#181610] border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                : 'bg-[#13131A] border-zinc-800'
            }`}
          >
            <div className="flex items-start justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                  v.isPrimary ? 'bg-[#D4AF37] text-black' : 'bg-zinc-800 text-zinc-400'
                }`}>
                  <Car className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-white">{v.brand} {v.model}</h3>
                    {v.isPrimary && (
                      <span className="text-[8px] bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 px-1.5 py-0.2 rounded font-semibold flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 fill-[#D4AF37]" /> คันหลัก
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-0.5">สี: {v.color} • ปี: {v.year}</p>
                </div>
              </div>

              <span className="font-mono font-bold text-xs text-amber-300 bg-black/50 px-2.5 py-1 rounded-lg border border-zinc-800">
                {v.licensePlate}
              </span>
            </div>

            <div className="pt-2.5 flex items-center justify-between text-xs">
              {!v.isPrimary ? (
                <button
                  onClick={() => handleSetPrimary(v.id)}
                  className="text-[10px] text-[#D4AF37] hover:underline font-medium cursor-pointer"
                >
                  ตั้งเป็นรถคันหลัก
                </button>
              ) : (
                <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> ตั้งเป็นคันหลักแล้ว
                </span>
              )}

              <button
                onClick={() => handleDeleteVehicle(v.id)}
                className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1 font-medium cursor-pointer"
              >
                <Trash2 className="w-3 h-3" /> ลบออก
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#121218] border border-[#D4AF37]/50 rounded-3xl p-5 relative shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <h3 className="text-sm font-bold text-amber-200">เพิ่มรถยนต์คันใหม่</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddVehicle} className="space-y-3">
              <div>
                <label className="text-[10px] text-zinc-400 font-medium block mb-1">เลขทะเบียนรถ *</label>
                <input
                  type="text"
                  required
                  value={newVehicle.licensePlate}
                  onChange={(e) => setNewVehicle({ ...newVehicle, licensePlate: e.target.value })}
                  placeholder="เช่น 3กข 1111"
                  className="w-full bg-[#1A1A22] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-zinc-400 font-medium block mb-1">ยี่ห้อ (Brand) *</label>
                  <input
                    type="text"
                    required
                    value={newVehicle.brand}
                    onChange={(e) => setNewVehicle({ ...newVehicle, brand: e.target.value })}
                    placeholder="เช่น BMW"
                    className="w-full bg-[#1A1A22] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 font-medium block mb-1">รุ่น (Model) *</label>
                  <input
                    type="text"
                    required
                    value={newVehicle.model}
                    onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                    placeholder="เช่น M4"
                    className="w-full bg-[#1A1A22] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-zinc-400 font-medium block mb-1">สีรถ (Color)</label>
                  <input
                    type="text"
                    value={newVehicle.color}
                    onChange={(e) => setNewVehicle({ ...newVehicle, color: e.target.value })}
                    placeholder="เช่น Green"
                    className="w-full bg-[#1A1A22] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 font-medium block mb-1">ปีรถ (Year)</label>
                  <input
                    type="text"
                    value={newVehicle.year}
                    onChange={(e) => setNewVehicle({ ...newVehicle, year: e.target.value })}
                    placeholder="2024"
                    className="w-full bg-[#1A1A22] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F3E5AB] to-[#D4AF37] text-black font-bold text-xs shadow-md mt-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูลรถ'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
