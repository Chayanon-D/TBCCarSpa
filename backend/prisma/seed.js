import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    console.log('🌱 Starting Prisma database seeding...');
    // 1. Create Default User
    const defaultUser = await prisma.user.upsert({
        where: { memberId: 'TBC-88992' },
        update: {},
        create: {
            lineUserId: 'U1234567890abcdef1234567890abcdef',
            lineDisplayName: 'คุณสมชาย ใจดี',
            linePictureUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
            firstName: 'สมชาย',
            lastName: 'ใจดี',
            phone: '081-234-5678',
            email: 'somchai.j@example.com',
            dob: '1992-05-15',
            province: 'กรุงเทพมหานคร',
            memberId: 'TBC-88992',
            memberLevel: 'Gold VIP',
            points: 1250,
            usageCount: 12,
            pdpaAccepted: true,
        },
    });
    console.log('👤 User seeded:', defaultUser.lineDisplayName);
    // 2. Create Vehicles for User
    await prisma.vehicle.deleteMany({ where: { userId: defaultUser.id } });
    const v1 = await prisma.vehicle.create({
        data: {
            licensePlate: '9กข 8899',
            brand: 'Porsche',
            model: 'Taycan Cross Turismo',
            color: 'Frozen Blue Metallic',
            year: '2023',
            isPrimary: true,
            userId: defaultUser.id,
        },
    });
    const v2 = await prisma.vehicle.create({
        data: {
            licensePlate: '1ขค 4455',
            brand: 'BMW',
            model: 'M4 Competition',
            color: 'Isle of Man Green',
            year: '2024',
            isPrimary: false,
            userId: defaultUser.id,
        },
    });
    console.log('🚘 Vehicles seeded');
    // 3. Create Spa Services
    await prisma.spaService.deleteMany({});
    const s1 = await prisma.spaService.create({
        data: {
            id: 'srv-1',
            name: 'Full Executive Detail & Ceramic Guard',
            description: 'บริการฟื้นฟูสีรถยนต์ระดับพรีเมียม ขัดเคลือบเงา Multi-stage + เคลือบแก้ว Ceramic 9H ปกป้องสีรถนาน 3 ปี',
            durationMinutes: 180,
            priceTHB: 1890,
            category: 'Coating & Paint',
            pointsEarned: 450,
            popular: true,
            badge: 'RECOMMENDED',
            steps: JSON.stringify([
                'ล้างอัดฉีดขจัดคราบยางมะตอย & ชักเงาด้วยน้ำยา Snow Foam pH-neutral',
                'ลูบดินน้ำมัน Clay Bar ขจัดละอองสีและคราบฝังลึกทั่วคัน',
                'ขัดปรับสภาพผิวสี Stage 1 & 2 ลบรอยขนแมวและชักเงา High Gloss',
                'พ่นและลงน้ำยาเคลือบแก้ว Ceramic Guard 9H ความหนา 50 ไมครอน',
                'อบอินฟราเรดเร่งความแข็งแรงผิว 60 นาที พร้อมทำความสะอาดห้องโดยสาร',
            ]),
            addons: JSON.stringify([
                { name: 'เคลือบกระจกรอบคัน กันน้ำ Hydrophobic', priceTHB: 850, note: 'ลดการเกาะของหยดน้ำและเพิ่มความชัดเจนยามฝนตก' },
                { name: 'อบโอโซนฆ่าเชื้อโรคด้วยแสง UV-C ในห้องโดยสาร', priceTHB: 500, note: 'กำจัดกลิ่นอับและแบคทีเรีย 99.9%' },
                { name: 'ทำความสะอาดและฟื้นฟูเบาะหนังแท้ Leather Care', priceTHB: 1200, note: 'คืนความนุ่มนวลป้องกันหนังแตกลายงา' },
            ]),
            note: 'ใช้เวลาประมาณ 3 ชั่วโมง แนะนำสำรองคิวล่วงหน้าอย่างน้อย 1 วัน',
        },
    });
    const s2 = await prisma.spaService.create({
        data: {
            id: 'srv-2',
            name: 'Premium Snow Foam Wash & Wax',
            description: 'ล้างรถสูตรสโนว์โฟมละลายคราบ ละเอียดทุกซอกมุม พร้อมลงแว็กซ์ Carnauba เกรดพรีเมียมเพิ่มความฉ่ำเงา',
            durationMinutes: 60,
            priceTHB: 590,
            category: 'Wash & Care',
            pointsEarned: 59,
            popular: true,
            badge: 'BEST SELLER',
            steps: JSON.stringify([
                'ฉีดล้างใต้ท้องรถและซุ้มล้อด้วยแรงดันสูง',
                'พ่นสโนว์โฟมสูตรอ่อนโยนขจัดคราบฝุ่นสกปรก',
                'เช็ดแห้งด้วยผ้าไมโครไฟเบอร์ไร้รอยขนแมว',
                'ลงแว็กซ์ Carnauba Premium ให้ประกายความเงางามฉ่ำลึก',
                'ดูดฝุ่นห้องโดยสารและเช็ดคอนโซลหน้า',
            ]),
            addons: JSON.stringify([
                { name: 'เคลือบยางดำสูตร Long-lasting Gloss', priceTHB: 150 },
                { name: 'ดูดฝุ่นทำความสะอาดช่องแอร์ด้วยแปรงละเอียด', priceTHB: 200 },
            ]),
        },
    });
    const s3 = await prisma.spaService.create({
        data: {
            id: 'srv-3',
            name: 'Deep Interior Spa & Anti-Bacterial',
            description: 'สปาห้องโดยสารซักเบาะ อบโอโซนกำจัดแบคทีเรียและกลิ่นอับ ให้ความสะอาดสุขอนามัยระดับโรงพยาบาล',
            durationMinutes: 120,
            priceTHB: 2200,
            category: 'Interior Spa',
            pointsEarned: 220,
            popular: false,
        },
    });
    console.log('🧼 Spa Services seeded');
    // 4. Create Spa Branches
    await prisma.spaBranch.deleteMany({});
    const b1 = await prisma.spaBranch.create({
        data: {
            id: 'branch-1',
            name: 'สาขาพระราม 9 (Headquarter Flagship)',
            address: '99/9 ถ.พระราม 9 ห้วยขวาง กรุงเทพฯ 10310',
            phone: '02-777-8899',
            distance: '2.4 กม.',
            openHours: '08:00 - 20:00 น. (เปิดทุกวัน)',
        },
    });
    const b2 = await prisma.spaBranch.create({
        data: {
            id: 'branch-2',
            name: 'สาขาประดิษฐ์มนูธรรม (เลียบด่วนเอกมัย-รามอินทรา)',
            address: '456 ถ.ประดิษฐ์มนูธรรม ลาดพร้าว กรุงเทพฯ 10230',
            phone: '02-555-1234',
            distance: '5.1 กม.',
            openHours: '08:30 - 19:30 น.',
        },
    });
    console.log('🏢 Branches seeded');
    // 5. Create Past Bookings
    await prisma.booking.deleteMany({});
    const booking1 = await prisma.booking.create({
        data: {
            id: 'bk-1001',
            bookingRef: 'TBC-20260803-089',
            date: '2026-08-03',
            time: '14:00 น.',
            status: 'In Progress',
            totalAmount: 4500,
            pointsEarned: 450,
            qrCode: 'TBC-QR-20260803-089',
            userId: defaultUser.id,
            serviceId: s1.id,
            vehicleId: v1.id,
            branchId: b1.id,
        },
    });
    const booking2 = await prisma.booking.create({
        data: {
            id: 'bk-1000',
            bookingRef: 'TBC-20260720-042',
            date: '2026-07-20',
            time: '10:30 น.',
            status: 'Completed',
            totalAmount: 590,
            pointsEarned: 59,
            qrCode: 'TBC-QR-20260720-042',
            userId: defaultUser.id,
            serviceId: s2.id,
            vehicleId: v2.id,
            branchId: b1.id,
        },
    });
    console.log('📅 Bookings seeded');
    // 6. Create Car Live Status for active booking
    await prisma.carLiveStatus.deleteMany({});
    await prisma.carLiveStatus.create({
        data: {
            bookingId: booking1.id,
            currentStep: 3,
            estimatedFinishTime: '16:30 น.',
            bayNumber: 'Bay 03 (Coating Room)',
            technicianName: 'ช่างวิชัย & ทีมงานมืออาชีพ (5 คน)',
            photoProgressUrl: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&q=80&w=600',
            stages: JSON.stringify([
                { step: 1, title: 'รับรถ & ตรวจสภาพผิวสี', subtitle: 'ถ่ายภาพ 360 องศาบันทึกรอยขีดข่วนเดิม', status: 'completed', time: '14:05 น.', notes: 'ตรวจพบรอยแมวเล็กน้อยบริเวณฝากระโปรงหน้า' },
                { step: 2, title: 'ล้างสโนว์โฟม & ลูบดินน้ำมัน', subtitle: 'ขจัดคราบยางมะตอย ละอองสี และฝุ่น PM2.5', status: 'completed', time: '14:35 น.', notes: 'เตรียมพื้นผิวพร้อมขัดเงา' },
                { step: 3, title: 'ขัดปรับสภาพสี Stage 2 Multi-Cut', subtitle: 'ลบรอยขนแมว ชักเงาลึก ปรับชั้นแลคเกอร์', status: 'current', time: 'กำลังดำเนินการ (15:10 น.)', notes: 'ช่างกำลังใช้เครื่องขัด Dual Action รอบต่ำ' },
                { step: 4, title: 'พ่นเคลือบแก้ว Ceramic 9H Guard', subtitle: 'ลงน้ำยาเกรดพรีเมียม 2 ชั้น อบ IR 60 นาที', status: 'upcoming', time: 'คาดว่าเริ่ม 15:45 น.' },
                { step: 5, title: 'ตรวจ QC & เช็ดรายละเอียดส่งมอบ', subtitle: 'ตรวจสอบความเงาด้วยเครื่อง Gloss Meter', status: 'upcoming', time: 'คาดว่าแล้วเสร็จ 16:30 น.' },
            ]),
        },
    });
    console.log('🚗 Car Live Status seeded');
    // 7. Seed Point Transactions
    await prisma.pointTransaction.deleteMany({ where: { userId: defaultUser.id } });
    await prisma.pointTransaction.createMany({
        data: [
            { userId: defaultUser.id, title: 'รับบริการ Full Executive Detail & Ceramic Guard', date: '03 ส.ค. 2026', amount: 450, type: 'earn', category: 'Car Spa Booking' },
            { userId: defaultUser.id, title: 'แลกรับคูปองส่วนลดล้างรถ 200 บาท', date: '25 ก.ค. 2026', amount: -300, type: 'redeem', category: 'Coupon Redemption' },
            { userId: defaultUser.id, title: 'รับบริการ Premium Snow Foam Wash', date: '20 ก.ค. 2026', amount: 59, type: 'earn', category: 'Car Spa Booking' },
            { userId: defaultUser.id, title: 'โบนัสต้อนรับสมาชิกระดับ Gold VIP', date: '01 ก.ค. 2026', amount: 1041, type: 'earn', category: 'VIP Bonus' },
        ],
    });
    // 8. Seed Rewards
    await prisma.rewardItem.deleteMany({});
    await prisma.rewardItem.createMany({
        data: [
            { id: 'rw-1', title: 'ส่วนลด 200 บาท สำหรับบริการทุกประเภท', description: 'ใช้เป็นส่วนลดท้ายบิลเมื่อรับบริการราคา 500 บาทขึ้นไป', ptsRequired: 300, category: 'Discount Coupon', isAvailable: true, code: 'DISC200PTS' },
            { id: 'rw-2', title: 'ฟรี! อบโอโซนฆ่าเชื้อโรคในห้องโดยสาร (มูลค่า 500.-)', description: 'กำจัดเชื้อแบคทีเรียและกลิ่นอับด้วยโอโซนบริสุทธิ์', ptsRequired: 500, category: 'Free Upgrade', isAvailable: true, code: 'FREE-OZONE' },
            { id: 'rw-3', title: 'ฟรี! เคลือบกระจกกันน้ำ Hydrophobic รอบคัน (มูลค่า 850.-)', description: 'ช่วยให้น้ำไม่เกาะกระจก เพิ่มความปลอดภัยยามฝนตก', ptsRequired: 800, category: 'Free Service', isAvailable: true, code: 'FREE-GLASS' },
            { id: 'rw-4', title: 'ฟรี! บริการล้างรถ Snow Foam Wash 1 ครั้ง (มูลค่า 590.-)', description: 'สิทธิ์ล้างรถสโนว์โฟมพร้อมเคลือบแว็กซ์พรีเมียม', ptsRequired: 1000, category: 'Free Service', isAvailable: true, code: 'FREE-WASH590' },
        ],
    });
    // 9. Seed Promotion Coupons
    await prisma.promotionCoupon.deleteMany({});
    await prisma.promotionCoupon.createMany({
        data: [
            { id: 'promo-1', title: 'ลดทันที 15% สำหรับบริการเคลือบแก้ว Ceramic Guard', description: 'สิทธิพิเศษเฉพาะสมาชิก Gold VIP & Platinum ขึ้นไป รับส่วนลด 15% ทันที', code: 'CERAMICVIP15', discountBadge: '15% OFF', validUntil: '31 ส.ค. 2026', minSpendTHB: 3000, isClaimed: false, bannerGradient: 'from-amber-500 to-yellow-700' },
            { id: 'promo-2', title: 'รับแต้มสะสม X2 เมื่อจองคิวรับบริการวันธรรมดา (จันทร์-ศุกร์)', description: 'จองคิวมอบความเงางามให้รถคันโปรดในวันธรรมดา รับแต้มสะสมคูณสองทันที', code: 'DOUBLEPOINTS', discountBadge: '2X POINTS', validUntil: '15 ก.ย. 2026', minSpendTHB: 500, isClaimed: true, bannerGradient: 'from-blue-600 to-indigo-800' },
            { id: 'promo-3', title: 'ฟรี! บริการอบโอโซนฆ่าเชื้อ มูลค่า 500 บาท เมื่อล้างรถซิกเนเจอร์', description: 'เมื่อเลือกรับบริการล้างรถสูตร Executive Wash ขึ้นไป', code: 'OZONEGIFT', discountBadge: 'FREE GIFT', validUntil: '30 ส.ค. 2026', minSpendTHB: 800, isClaimed: false, bannerGradient: 'from-emerald-500 to-teal-800' },
        ],
    });
    // 10. Seed Notifications
    await prisma.notification.deleteMany({ where: { userId: defaultUser.id } });
    await prisma.notification.createMany({
        data: [
            { userId: defaultUser.id, title: 'อัปเดตสถานะรถ (Live)', message: 'รถ Porsche Taycan (9กข 8899) กำลังอยู่ในขั้นตอน ขัดปรับสภาพสี Stage 2 Multi-Cut', time: '10 นาทีที่แล้ว', read: false, type: 'status' },
            { userId: defaultUser.id, title: 'ยืนยันการจองคิวสำเร็จ', message: 'การจองคิวหมายเลข TBC-20260803-089 สำหรับวันที่ 03 ส.ค. 2026 เวลา 14:00 น. ได้รับการยืนยันแล้ว', time: '1 ชั่วโมงที่แล้ว', read: false, type: 'booking' },
            { userId: defaultUser.id, title: 'สิทธิพิเศษเดือนสิงหาคม', message: 'คุณได้รับคูปองส่วนลดพิเศษ 15% สำหรับบริการ Ceramic Guard ตรวจสอบได้ที่หน้าโปรโมชั่น', time: '1 วันที่แล้ว', read: true, type: 'promo' },
        ],
    });
    console.log('🔔 Notifications seeded');
    console.log('✅ Database seeding complete!');
}
main()
    .catch((e) => {
        console.error('❌ Seeding error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
