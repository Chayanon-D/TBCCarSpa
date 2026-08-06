import React, { useState } from 'react';
import { ScreenId, UserProfile, Vehicle } from '../../types';
import { User, Car, ArrowRight, CheckSquare, Square } from 'lucide-react';
import { apiService } from '../../services/api';

interface RegisterScreenProps {
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  onNavigate: (screen: ScreenId) => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  user,
  onUpdateUser,
  onNavigate,
}) => {
  const [formData, setFormData] = useState({
    firstName: user.firstName || 'สมชาย',
    lastName: user.lastName || 'ใจดี',
    phone: user.phone || '081-234-5678',
    email: user.email || 'somchai@tbc-carspa.com',
    dob: user.dob || '1992-05-15',
    province: user.province || 'กรุงเทพมหานคร',
    licensePlate: user.vehicles[0]?.licensePlate || '9กข 8899',
    brand: user.vehicles[0]?.brand || 'Porsche',
    model: user.vehicles[0]?.model || 'Taycan Cross Turismo',
    color: user.vehicles[0]?.color || 'Frozen Blue Metallic',
    year: user.vehicles[0]?.year || '2023',
    pdpaAccepted: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.pdpaAccepted) {
      setErrors({ pdpa: 'กรุณายินยอมนโยบาย PDPA ก่อนสมัครสมาชิก' });
      return;
    }

    setSubmitting(true);
    try {
      // 1. Update Profile in DB via Backend API
      const updatedUser = await apiService.updateUserProfile({
        userId: user.id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        dob: formData.dob,
        province: formData.province,
      });

      // 2. Add vehicle via Backend API
      const newVehicle = await apiService.addVehicle({
        userId: user.id,
        licensePlate: formData.licensePlate,
        brand: formData.brand,
        model: formData.model,
        color: formData.color,
        year: formData.year,
        isPrimary: true,
      });

      onUpdateUser({
        ...updatedUser,
        vehicles: [newVehicle, ...(updatedUser.vehicles || []).filter((v) => v.licensePlate !== newVehicle.licensePlate)],
      });

      onNavigate('reg_success');
    } catch (err) {
      console.error('Registration failed:', err);
      // Fallback local update if offline
      const updatedVehicle: Vehicle = {
        id: 'v_' + Date.now(),
        licensePlate: formData.licensePlate,
        brand: formData.brand,
        model: formData.model,
        color: formData.color,
        year: formData.year,
        isPrimary: true,
      };

      onUpdateUser({
        ...user,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        dob: formData.dob,
        province: formData.province,
        pdpaAccepted: true,
        vehicles: [updatedVehicle, ...user.vehicles],
      });
      onNavigate('reg_success');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 bg-[#0A0A0E] text-white space-y-4">
      <div className="p-3.5 rounded-2xl bg-[#14141C] border border-[#D4AF37]/30 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#F3E5AB] to-[#D4AF37] text-black font-bold flex items-center justify-center text-xs">
            01
          </div>
          <div>
            <h2 className="text-xs font-bold text-amber-200">ลงทะเบียนสมาชิกใหม่</h2>
            <p className="text-[10px] text-zinc-400">กรอกข้อมูลเพื่อรับสิทธิประโยชน์และคะแนนเริ่มต้น</p>
          </div>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 font-medium">
          +500 แต้มฟรี
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-4 rounded-2xl bg-[#121218] border border-zinc-800 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-800 text-[#D4AF37]">
            <User className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-200">ข้อมูลส่วนบุคคล (Personal Details)</h3>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[10px] text-zinc-400 font-medium block mb-1">ชื่อ (First Name) *</label>
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                placeholder="เช่น สมชาย"
                className="w-full bg-[#1A1A22] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-zinc-400 font-medium block mb-1">นามสกุล (Last Name) *</label>
              <input
                type="text"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                placeholder="เช่น ใจดี"
                className="w-full bg-[#1A1A22] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[10px] text-zinc-400 font-medium block mb-1">เบอร์โทรศัพท์ (Phone) *</label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="08X-XXX-XXXX"
                className="w-full bg-[#1A1A22] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-zinc-400 font-medium block mb-1">Email *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="example@mail.com"
                className="w-full bg-[#1A1A22] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[10px] text-zinc-400 font-medium block mb-1">วันเกิด (Date of Birth) *</label>
              <input
                type="date"
                name="dob"
                required
                value={formData.dob}
                onChange={handleChange}
                className="w-full bg-[#1A1A22] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-zinc-400 font-medium block mb-1">จังหวัด (Province) *</label>
              <select
                name="province"
                value={formData.province}
                onChange={handleChange}
                className="w-full bg-[#1A1A22] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
              >
                <option value="กรุงเทพมหานคร">กรุงเทพมหานคร</option>
                <option value="นนทบุรี">นนทบุรี</option>
                <option value="ปทุมธานี">ปทุมธานี</option>
                <option value="สมุทรปราการ">สมุทรปราการ</option>
                <option value="ชลบุรี">ชลบุรี</option>
                <option value="เชียงใหม่">เชียงใหม่</option>
                <option value="ภูเก็ต">ภูเก็ต</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#121218] border border-zinc-800 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-800 text-[#D4AF37]">
            <Car className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-200">ข้อมูลรถคันหลัก (Primary Vehicle)</h3>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[10px] text-zinc-400 font-medium block mb-1">เลขทะเบียนรถ *</label>
              <input
                type="text"
                name="licensePlate"
                required
                value={formData.licensePlate}
                onChange={handleChange}
                placeholder="เช่น 9กข 8899"
                className="w-full bg-[#1A1A22] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none font-bold tracking-wide text-amber-300"
              />
            </div>
            <div>
              <label className="text-[10px] text-zinc-400 font-medium block mb-1">ยี่ห้อรถ (Brand) *</label>
              <input
                type="text"
                name="brand"
                required
                value={formData.brand}
                onChange={handleChange}
                placeholder="เช่น Porsche / BMW"
                className="w-full bg-[#1A1A22] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] text-zinc-400 font-medium block mb-1">รุ่นรถ (Model) *</label>
              <input
                type="text"
                name="model"
                required
                value={formData.model}
                onChange={handleChange}
                placeholder="เช่น Taycan"
                className="w-full bg-[#1A1A22] border border-zinc-700 rounded-xl px-2.5 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-zinc-400 font-medium block mb-1">สีรถ (Color) *</label>
              <input
                type="text"
                name="color"
                required
                value={formData.color}
                onChange={handleChange}
                placeholder="เช่น Frozen Blue"
                className="w-full bg-[#1A1A22] border border-zinc-700 rounded-xl px-2.5 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-zinc-400 font-medium block mb-1">ปีรถ (Year)</label>
              <input
                type="text"
                name="year"
                value={formData.year}
                onChange={handleChange}
                placeholder="2023"
                className="w-full bg-[#1A1A22] border border-zinc-700 rounded-xl px-2.5 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#14141D] border border-zinc-800 space-y-2">
          <div
            onClick={() => setFormData((p) => ({ ...p, pdpaAccepted: !p.pdpaAccepted }))}
            className="flex items-start gap-2.5 cursor-pointer select-none"
          >
            {formData.pdpaAccepted ? (
              <CheckSquare className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
            ) : (
              <Square className="w-5 h-5 text-zinc-500 shrink-0 mt-0.5" />
            )}
            <p className="text-[11px] text-zinc-300 leading-relaxed">
              ข้าพเจ้ายินยอมให้บริษัท TBC CAR SPA เก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคล เพื่อการให้บริการ การจัดเก็บแต้มสะสม และรับข่าวสารโปรโมชั่นตาม{' '}
              <span className="text-[#D4AF37] underline">นโยบายคุ้มครองข้อมูลส่วนบุคคล (PDPA)</span>
            </p>
          </div>
          {errors.pdpa && <p className="text-[10px] text-red-400 font-medium">{errors.pdpa}</p>}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#B8860B] text-black font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.4)] active:scale-95 transition-all cursor-pointer disabled:opacity-50"
        >
          {submitting ? (
            <span>กำลังบันทึกข้อมูลลง Database...</span>
          ) : (
            <>
              <span>ยืนยันการสมัครสมาชิก</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
