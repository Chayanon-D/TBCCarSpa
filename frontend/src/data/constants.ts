import { SpaService, SpaBranch } from '../types';

export const SPA_SERVICES: SpaService[] = [
  {
    id: 's1',
    name: '1. ล้างรถ + เคลือบสี',
    name_en: '1. Wash + Paint Coating',
    description: 'บริการล้างทำความสะอาดภายนอกและภายใน พร้อมลงน้ำยาเคลือบสีเพิ่มความเงางามและคุ้มค่า',
    description_en: 'Full exterior & interior wash with premium paint coating for extra shine and protection.',
    durationMinutes: 45,
    priceTHB: 590,
    category: 'Wash & Care',
    pointsEarned: 59,
    popular: true,
    steps: [
      'ล้างทำความสะอาดสโนว์โฟม pH-Neutral',
      'ดูดฝุ่นทำความสะอาดภายใน',
      'เคลือบสีด้วยน้ำยาเงาพรีเมียม'
    ],
    steps_en: [
      'pH-Neutral snow foam exterior wash',
      'Interior vacuum & dust removal',
      'Premium paint coating application'
    ]
  },
  {
    id: 's2',
    name: '2. ขัดเคลือบสี 2STEP',
    name_en: '2. 2-Step Paint Polish & Coat',
    description: 'บริการขัดขี้ไคลและเคลือบสี 2 Step (รถทุกขนาดยกเว้นรถตู้) 🚫 ไม่รวมการขัดลบรอย',
    description_en: '2-Step clay bar decontamination & paint coating (all vehicles except vans) 🚫 Scratch removal not included.',
    durationMinutes: 90,
    priceTHB: 1190,
    category: 'Coating & Paint',
    pointsEarned: 180,
    badge: 'ขัดขี้ไคล & เคลือบสี',
    badge_en: 'Clay Bar & Coating',
    steps: [
      'บริการหลัก - Medium Cut: ขัดคราบไคลและรอยขนแมวบางๆ',
      'บริการหลัก - Polishing: การเคลือบสีด้วยน้ำยาคุณภาพสูงเพื่อเพิ่มความเงางาม'
    ],
    steps_en: [
      'Medium Cut: Clay bar decontamination & light swirl mark removal',
      'Polishing: High-quality paint coating for deep gloss enhancement'
    ],
    addons: [
      {
        name: 'Premium Flex Coat (+600 บาท)',
        priceTHB: 600,
        note: 'เพิ่มความเงาฉ่ำและความทนทาน 4-8 เดือน (กระบวนการลง Flex Coat ใช้เทคนิคเดียวกับการเคลือบแก้ว กรุณาเตรียมเวลาไว้ประมาณ 2 ชั่วโมง)'
      }
    ],
    note: 'โปรดทราบ: บริการนี้สำหรับรถทุกขนาดยกเว้นรถตู้ และไม่รวมการขัดลบรอย'
  },
  {
    id: 's3',
    name: '3. ขัดเคลือบสี 3STEP',
    name_en: '3. 3-Step Full Polish & Coat',
    description: 'บริการขัดเคลือบสีเต็มระบบ 3 ขั้นตอน เพื่อให้รถของคุณสวยงามอย่างเต็มที่',
    description_en: 'Full 3-step paint correction & coating system for showroom-level results.',
    durationMinutes: 180,
    priceTHB: 2990,
    category: 'Coating & Paint',
    pointsEarned: 350,
    popular: true,
    badge: 'ขัดเต็มระบบ 3 ขั้นตอน',
    badge_en: 'Full 3-Step System',
    steps: [
      '1. ขัดลบรอยต่างๆ: แก้ไข Hologram, Swirl Marks, ขี้ไคล, รอยขนแมว และรอยอื่นๆ ที่ยังไม่เสียหายถึงเนื้อสี',
      '2. ขัดละเอียด Medium Cut: ใช้น้ำยาขัดละเอียดเพื่อเก็บรอยจากการขัดขั้นตอนแรกและทำความสะอาดอย่างละเอียด',
      '3. ขัดเคลือบเงา Machine Polish: ดึงเม็ดสีของรถเพื่อเพิ่มความเงางาม พร้อมเคลือบด้วยน้ำยาเคลือบเงาคุณภาพสูง (Menzerna) ที่ช่วยกันน้ำและกันฝุ่น จบงานอย่างสมบูรณ์แบบ'
    ],
    steps_en: [
      '1. Defect Removal: Correct holograms, swirl marks, clay deposits, light scratches & surface defects (not through the clear coat)',
      '2. Medium Cut Polish: Fine polishing compound to remove step-1 marks and deep clean the surface',
      '3. Machine Polish & Gloss Coat: Enhance paint depth & clarity, finish with high-grade Menzerna gloss coat for hydrophobic protection'
    ]
  },
  {
    id: 's4',
    name: '4. ขัดเคลือบสี 4STEP',
    name_en: '4. 4-Step Showroom Perfect Coat',
    description: 'จัดเต็มเพื่อความสวยแบบรถโชว์ (Perfect Score) พร้อมเคลือบแก้วและปกป้องยาวนาน',
    description_en: 'The ultimate showroom-perfect treatment with full glass ceramic coating for long-lasting protection.',
    durationMinutes: 240,
    priceTHB: 8900,
    category: 'Coating & Paint',
    pointsEarned: 890,
    popular: true,
    badge: 'Showroom Perfect 🏆',
    badge_en: 'Showroom Perfect 🏆',
    steps: [
      'ขัดสีเตรียมพื้นผิวเต็มระบบ 4 Step',
      'ลงน้ำยาเคลือบแก้วทั้งหมด 2 Coat',
      'Top Coat สำหรับเคลือบแก้ว เพิ่มความฉ่ำเงาลึก',
      'ปกป้องสีรถยาวนาน 24-36 เดือน'
    ],
    steps_en: [
      'Full 4-step paint surface preparation & correction',
      'Apply 2-coat ceramic glass coating',
      'Top Coat for ceramic — adds deep wet-look gloss',
      'Long-term paint protection 24–36 months'
    ]
  },
  {
    id: 's5',
    name: '5. ขัด-เคลือบสี 2STEP รถตู้',
    name_en: '5. 2-Step Polish & Coat (Van)',
    description: 'จัดเต็มเพื่อความสวยแบบรถโชว์ ออกแบบพิเศษสำหรับรถตู้โดยเฉพาะ',
    description_en: 'Showroom-quality polish & coat specially designed for full-size vans.',
    durationMinutes: 210,
    priceTHB: 1890,
    category: 'Coating & Paint',
    pointsEarned: 450,
    badge: 'สำหรับรถตู้ VIP 🚐',
    badge_en: 'VIP Van Service 🚐',
    steps: [
      'ขัดสีเตรียมพื้นผิวเต็มระบบสำหรับรถตู้ 4 Step',
      'ลงน้ำยาเคลือบแก้วทั้งหมด 2 Coat',
      'Top Coat สำหรับเคลือบแก้ว เพิ่มความฉ่ำ',
      'ปกป้องสีรถยาวนาน 24-36 เดือน'
    ],
    steps_en: [
      'Full 4-step paint prep & correction for van-size vehicles',
      'Apply 2-coat ceramic glass coating',
      'Top Coat for extra gloss depth',
      'Long-term protection 24–36 months'
    ]
  }
];

export const SPA_BRANCHES: SpaBranch[] = [
  {
    id: 'b1',
    name: 'สาขาหลัก พณิชยการธนบุรี (Main Branch)',
    name_en: 'Main Branch - Panitchayakan Thon Buri',
    address: 'เลขที่ 1 Soi Panitchayakan Thon Buri 21, Wat Tha Phra, Bangkok Yai, Bangkok 10600',
    phone: '02-111-8888',
    distance: '1.2 กม.',
    openHours: '08:00 - 20:00 น. (เปิดทุกวัน)',
    openHours_en: '08:00 - 20:00 (Open Daily)',
  },
];
