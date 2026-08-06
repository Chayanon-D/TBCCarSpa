import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Prisma database seeding (Pure Clean Real-Data Mode)...');

  // 0. Clean up all tables in reverse order of relations
  console.log('🧹 Cleaning all existing records...');
  await prisma.carLiveStatus.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.vehicle.deleteMany({});
  await prisma.spaService.deleteMany({});
  await prisma.spaBranch.deleteMany({});
  await prisma.pointTransaction.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.rewardItem.deleteMany({});
  await prisma.promotionCoupon.deleteMany({});

  // 1. Create Clean Default User (0 vehicles, 0 fake bookings)
  const defaultUser = await prisma.user.upsert({
    where: { memberId: 'TBC-88992' },
    update: {
      points: 0,
      usageCount: 0,
    },
    create: {
      lineUserId: 'U1234567890abcdef1234567890abcdef',
      lineDisplayName: 'คุณสมาชิก TBC CAR SPA',
      linePictureUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      firstName: 'สมาชิก',
      lastName: 'TBC',
      phone: '081-234-5678',
      email: 'member@tbc-carspa.com',
      dob: '1995-01-01',
      province: 'กรุงเทพมหานคร',
      memberId: 'TBC-88992',
      memberLevel: 'Silver Member',
      points: 0,
      usageCount: 0,
      pdpaAccepted: true,
    },
  });

  console.log('👤 Clean User profile created:', defaultUser.lineDisplayName);

  // 2. Create strictly the 5 Spa Services requested
  await prisma.spaService.create({
    data: {
      id: 's1',
      name: '1. ล้างรถ + เคลือบสี',
      description: 'บริการล้างทำความสะอาดภายนอกและภายใน พร้อมลงน้ำยาเคลือบสีเพิ่มความเงางามและคุ้มค่า',
      durationMinutes: 45,
      priceTHB: 590,
      category: 'Wash & Care',
      pointsEarned: 59,
      popular: true,
      badge: null,
      steps: JSON.stringify([
        'ล้างทำความสะอาดสโนว์โฟม pH-Neutral',
        'ดูดฝุ่นทำความสะอาดภายใน',
        'เคลือบสีด้วยน้ำยาเงาพรีเมียม',
      ]),
    },
  });

  await prisma.spaService.create({
    data: {
      id: 's2',
      name: '2. ขัดเคลือบสี 2STEP',
      description: 'บริการขัดขี้ไคลและเคลือบสี 2 Step (รถทุกขนาดยกเว้นรถตู้) 🚫 ไม่รวมการขัดลบรอย',
      durationMinutes: 90,
      priceTHB: 1190,
      category: 'Coating & Paint',
      pointsEarned: 180,
      popular: false,
      badge: 'ขัดขี้ไคล & เคลือบสี',
      steps: JSON.stringify([
        'บริการหลัก - Medium Cut: ขัดคราบไคลและรอยขนแมวบางๆ',
        'บริการหลัก - Polishing: การเคลือบสีด้วยน้ำยาคุณภาพสูงเพื่อเพิ่มความเงางาม',
      ]),
      addons: JSON.stringify([
        {
          name: 'Premium Flex Coat (+600 บาท)',
          priceTHB: 600,
          note: 'เพิ่มความเงาฉ่ำและความทนทาน 4-8 เดือน (กระบวนการลง Flex Coat ใช้เทคนิคเดียวกับการเคลือบแก้ว กรุณาเตรียมเวลาไว้ประมาณ 2 ชั่วโมง)',
        },
      ]),
      note: 'โปรดทราบ: บริการนี้สำหรับรถทุกขนาดยกเว้นรถตู้ และไม่รวมการขัดลบรอย',
    },
  });

  await prisma.spaService.create({
    data: {
      id: 's3',
      name: '3. ขัดเคลือบสี 3STEP',
      description: 'บริการขัดเคลือบสีเต็มระบบ 3 ขั้นตอน เพื่อให้รถของคุณสวยงามอย่างเต็มที่',
      durationMinutes: 180,
      priceTHB: 2990,
      category: 'Coating & Paint',
      pointsEarned: 350,
      popular: true,
      badge: 'ขัดเต็มระบบ 3 ขั้นตอน',
      steps: JSON.stringify([
        '1. ขัดลบรอยต่างๆ: แก้ไข Hologram, Swirl Marks, ขี้ไคล, รอยขนแมว และรอยอื่นๆ ที่ยังไม่เสียหายถึงเนื้อสี',
        '2. ขัดละเอียด Medium Cut: ใช้น้ำยาขัดละเอียดเพื่อเก็บรอยจากการขัดขั้นตอนแรกและทำความสะอาดอย่างละเอียด',
        '3. ขัดเคลือบเงา Machine Polish: ดึงเม็ดสีของรถเพื่อเพิ่มความเงางาม พร้อมเคลือบด้วยน้ำยาเคลือบเงาคุณภาพสูง (Menzerna) ที่ช่วยกันน้ำและกันฝุ่น จบงานอย่างสมบูรณ์แบบ',
      ]),
    },
  });

  await prisma.spaService.create({
    data: {
      id: 's4',
      name: '4. ขัดเคลือบสี 4STEP',
      description: 'จัดเต็มเพื่อความสวยแบบรถโชว์ (Perfect Score) พร้อมเคลือบแก้วและปกป้องยาวนาน',
      durationMinutes: 240,
      priceTHB: 8900,
      category: 'Coating & Paint',
      pointsEarned: 890,
      popular: true,
      badge: 'Showroom Perfect 🏆',
      steps: JSON.stringify([
        'ขัดสีเตรียมพื้นผิวเต็มระบบ 4 Step',
        'ลงน้ำยาเคลือบแก้วทั้งหมด 2 Coat',
        'Top Coat สำหรับเคลือบแก้ว เพิ่มความฉ่ำเงาลึก',
        'ปกป้องสีรถยาวนาน 24-36 เดือน',
      ]),
    },
  });

  await prisma.spaService.create({
    data: {
      id: 's5',
      name: '5. ขัด-เคลือบสี 2STEP รถตู้',
      description: 'จัดเต็มเพื่อความสวยแบบรถโชว์ ออกแบบพิเศษสำหรับรถตู้โดยเฉพาะ',
      durationMinutes: 210,
      priceTHB: 1890,
      category: 'Coating & Paint',
      pointsEarned: 450,
      popular: false,
      badge: 'สำหรับรถตู้ VIP 🚐',
      steps: JSON.stringify([
        'ขัดสีเตรียมพื้นผิวเต็มระบบสำหรับรถตู้ 4 Step',
        'ลงน้ำยาเคลือบแก้วทั้งหมด 2 Coat',
        'Top Coat สำหรับเคลือบแก้ว เพิ่มความฉ่ำ',
        'ปกป้องสีรถยาวนาน 24-36 เดือน',
      ]),
    },
  });

  console.log('🧼 5 Spa Services seeded');

  // 3. Create Main Spa Branch
  await prisma.spaBranch.create({
    data: {
      id: 'b1',
      name: 'สาขาหลัก พณิชยการธนบุรี (Main Branch)',
      address: 'เลขที่ 1 Soi Panitchayakan Thon Buri 21, Wat Tha Phra, Bangkok Yai, Bangkok 10600',
      phone: '02-111-8888',
      distance: '1.2 กม.',
      openHours: '08:00 - 20:00 น. (เปิดทุกวัน)',
    },
  });

  console.log('🏢 Main Spa Branch seeded');

  // 4. Seed Reward Coupons
  await prisma.rewardItem.createMany({
    data: [
      { id: 'rw-1', title: 'ส่วนลด 200 บาท สำหรับบริการทุกประเภท', description: 'ใช้เป็นส่วนลดท้ายบิลเมื่อรับบริการราคา 500 บาทขึ้นไป', ptsRequired: 300, category: 'Discount Coupon', isAvailable: true, code: 'DISC200PTS' },
      { id: 'rw-2', title: 'ฟรี! อบโอโซนฆ่าเชื้อโรคในห้องโดยสาร (มูลค่า 500.-)', description: 'กำจัดเชื้อแบคทีเรียและกลิ่นอับด้วยโอโซนบริสุทธิ์', ptsRequired: 500, category: 'Free Upgrade', isAvailable: true, code: 'FREE-OZONE' },
    ],
  });

  // 5. Seed Promotion Coupons
  await prisma.promotionCoupon.createMany({
    data: [
      { id: 'promo-1', title: 'ลดทันที 15% สำหรับบริการขัดเคลือบสี 4STEP', description: 'สิทธิพิเศษเฉพาะสมาชิก TBC CAR SPA รับส่วนลด 15% ทันที', code: 'CERAMICVIP15', discountBadge: '15% OFF', validUntil: '31 ส.ค. 2026', minSpendTHB: 3000, isClaimed: false, bannerGradient: 'from-amber-500 to-yellow-700' },
      { id: 'promo-2', title: 'รับแต้มสะสม X2 เมื่อจองคิวรับบริการวันธรรมดา (จันทร์-ศุกร์)', description: 'จองคิวมอบความเงางามให้รถคันโปรดในวันธรรมดา รับแต้มสะสมคูณสองทันที', code: 'DOUBLEPOINTS', discountBadge: '2X POINTS', validUntil: '15 ก.ย. 2026', minSpendTHB: 500, isClaimed: false, bannerGradient: 'from-blue-600 to-indigo-800' },
    ],
  });

  console.log('✅ Clean Database seeding complete (0 mock vehicles, 0 fake bookings)!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
