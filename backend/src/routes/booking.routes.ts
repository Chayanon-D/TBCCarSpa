import { Router, Response } from 'express';
import { prisma } from '../db/prisma.js';
import { tenantResolverMiddleware, TenantRequest } from '../middleware/tenantResolver.js';

const router = Router();

const MAX_GLOBAL_SHOP_CAPACITY = 3;

// Apply Multi-Tenant Resolver Middleware to all booking routes
router.use(tenantResolverMiddleware);

// Helper to determine available bay for global active cars
function getAssignedBay(activeCount: number): string {
  if (activeCount === 0) return 'Bay 01 (Detailing Zone)';
  if (activeCount === 1) return 'Bay 02 (Coating Room)';
  return 'Bay 03 (VIP Lounge)';
}

function checkIsAdmin(lineUserIdHeader?: string): boolean {
  const rawEnv = process.env.ADMIN_LINE_USER_IDS || '';
  const allowedAdminIds = rawEnv
    .split(',')
    .map((id) => id.replace(/["'\s]/g, '').trim())
    .filter(Boolean);

  if (allowedAdminIds.length === 0 || allowedAdminIds.includes('*')) return true;
  if (!lineUserIdHeader) return false;

  const cleanHeaderId = lineUserIdHeader.replace(/["'\s]/g, '').trim();
  return allowedAdminIds.includes(cleanHeaderId);
}

// GET /api/services - Fetch available spa services
router.get('/services', async (_req: TenantRequest, res: Response) => {
  try {
    const services = await prisma.spaService.findMany();
    const formattedServices = services.map((s) => ({
      ...s,
      steps: s.steps ? JSON.parse(s.steps) : [],
      addons: s.addons ? JSON.parse(s.addons) : [],
    }));

    return res.json(formattedServices);
  } catch (error) {
    console.error('Error fetching services:', error);
    return res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// GET /api/branches - Fetch spa branch locations
router.get('/branches', async (_req: TenantRequest, res: Response) => {
  try {
    const branches = await prisma.spaBranch.findMany();
    return res.json(branches);
  } catch (error) {
    console.error('Error fetching branches:', error);
    return res.status(500).json({ error: 'Failed to fetch branches' });
  }
});

// GET /api/bookings/availability - Fetch Global Shop 3-Car Capacity & Occupancy
router.get('/bookings/availability', async (_req: TenantRequest, res: Response) => {
  try {
    const totalActiveCarsInShop = await prisma.booking.count({
      where: {
        status: { in: ['Confirmed', 'In Progress'] },
      },
    });

    const isShopFull = totalActiveCarsInShop >= MAX_GLOBAL_SHOP_CAPACITY;
    const availableBays = Math.max(0, MAX_GLOBAL_SHOP_CAPACITY - totalActiveCarsInShop);

    return res.json({
      totalActiveCarsInShop,
      maxShopCapacity: MAX_GLOBAL_SHOP_CAPACITY,
      availableBays,
      isShopFull,
      status: isShopFull ? 'FULL' : totalActiveCarsInShop > 0 ? 'PARTIAL' : 'EMPTY',
    });
  } catch (error) {
    console.error('Error checking global shop availability:', error);
    return res.status(500).json({ error: 'Failed to check shop availability' });
  }
});

// GET /api/bookings - Fetch tenant's isolated booking history or admin full queue
router.get('/bookings', async (req: TenantRequest, res: Response) => {
  try {
    const tenantUser = req.tenantUser;
    const { userId } = req.query;
    const lineUserIdHeader = (req.headers['x-line-user-id'] as string) || '';

    const isAdmin = checkIsAdmin(lineUserIdHeader);

    let whereCondition: any = {};

    if (!isAdmin) {
      let targetUserId = tenantUser?.id;
      if (!targetUserId && userId) {
        targetUserId = String(userId);
      }
      if (!targetUserId) {
        const defaultUser = await prisma.user.findFirst();
        targetUserId = defaultUser?.id;
      }
      whereCondition = { userId: targetUserId };
    } else if (userId) {
      whereCondition = { userId: String(userId) };
    }

    const bookings = await prisma.booking.findMany({
      where: whereCondition,
      include: {
        service: true,
        vehicle: true,
        branch: true,
        carLiveStatus: true,
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedBookings = bookings.map((b) => ({
      ...b,
      service: {
        ...b.service,
        steps: b.service.steps ? JSON.parse(b.service.steps) : [],
        addons: b.service.addons ? JSON.parse(b.service.addons) : [],
      },
    }));

    return res.json(formattedBookings);
  } catch (error) {
    console.error('Error fetching tenant bookings:', error);
    return res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// POST /api/bookings - Create new booking with status 'Pending Deposit Approval'
router.post('/bookings', async (req: TenantRequest, res: Response) => {
  try {
    const tenantUser = req.tenantUser;
    const { userId, serviceId, vehicleId, branchId, date, time, slipUrl, customDepositAmount } = req.body;

    let targetUserId = tenantUser?.id || userId;

    if (!targetUserId) {
      const defaultUser = await prisma.user.findFirst();
      targetUserId = defaultUser?.id;
    }

    const service = await prisma.spaService.findUnique({ where: { id: serviceId } });
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Mandatory Deposit Calculation Rule:
    // Services >= 2,990 THB require 500 THB deposit; Services < 2,990 THB require 300 THB deposit
    const depositAmount = customDepositAmount
      ? Number(customDepositAmount)
      : service.priceTHB >= 2990
      ? 500
      : 300;

    const remainingAmount = Math.max(0, service.priceTHB - depositAmount);

    // 1. Check Global active cars currently in the shop (uncompleted)
    const totalActiveCarsInShop = await prisma.booking.count({
      where: {
        status: { in: ['Confirmed', 'In Progress'] },
      },
    });

    const isShopFull = totalActiveCarsInShop >= MAX_GLOBAL_SHOP_CAPACITY;
    const assignedBay = getAssignedBay(Math.min(totalActiveCarsInShop, 2));
    const queueTicket = isShopFull
      ? `FIFO-WAITING-Q${totalActiveCarsInShop - 2}`
      : `FIFO-Q${totalActiveCarsInShop + 1}`;

    const bookingRef = `TBC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`;

    // 2. Save Booking with initial status 'Pending Deposit Approval'
    const newBooking = await prisma.booking.create({
      data: {
        bookingRef,
        date,
        time,
        status: 'Pending Deposit Approval', // Initial status awaiting Admin verification
        totalAmount: service.priceTHB,
        depositAmount,
        remainingAmount,
        slipUrl: slipUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600',
        paymentStatus: 'Pending Deposit Verification',
        pointsEarned: service.pointsEarned,
        qrCode: `TBC-QR-${bookingRef}`,
        userId: targetUserId,
        serviceId,
        vehicleId,
        branchId,
        carLiveStatus: {
          create: {
            currentStep: 1,
            bayNumber: assignedBay,
            technicianName: 'ทีมงาน Master Detailer',
            estimatedFinishTime: '17:00 น.',
            photoProgressUrl: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&q=80&w=600',
            stages: JSON.stringify([
              { step: 1, title: '1. กำลังรออนุมัติมัดจำ (Pending)', subtitle: `รอ Admin ตรวจสอบสลิปมัดจำ ฿${depositAmount}`, status: 'current', time },
              { step: 2, title: '2. กำลังล้าง (Washing)', subtitle: 'ฉีดโฟม pH-Neutral + ลูบดินน้ำมัน', status: 'upcoming', time: 'คิวถัดไป' },
              { step: 3, title: '3. กำลังขัด & เคลือบ (Polishing)', subtitle: 'ขัดชักเงาละเอียด + ลง Glass Coating', status: 'upcoming', time: 'คิวถัดไป' },
              { step: 4, title: '4. ตรวจ QC (Inspection)', subtitle: 'ตรวจความเรียบร้อย 24 จุด', status: 'upcoming', time: 'คิวถัดไป' },
              { step: 5, title: '5. เสร็จแล้ว พร้อมรับรถ (Ready)', subtitle: 'จอดรอที่โซน VIP Lounge', status: 'upcoming', time: 'คิวถัดไป' },
            ]),
          },
        },
      },
      include: {
        service: true,
        vehicle: true,
        branch: true,
        carLiveStatus: true,
      },
    });

    // Update user points and usage count
    await prisma.user.update({
      where: { id: targetUserId },
      data: {
        points: { increment: service.pointsEarned },
        usageCount: { increment: 1 },
      },
    });

    // Log point transaction
    await prisma.pointTransaction.create({
      data: {
        userId: targetUserId,
        title: `จองคิวบริการ ${service.name} (โอนมัดจำ ฿${depositAmount} - รอ Admin ตรวจสอบ)`,
        date: new Date().toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric' }),
        amount: service.pointsEarned,
        type: 'earn',
        category: 'Car Spa Deposit',
      },
    });

    const formattedBooking = {
      ...newBooking,
      service: {
        ...newBooking.service,
        steps: newBooking.service.steps ? JSON.parse(newBooking.service.steps) : [],
        addons: newBooking.service.addons ? JSON.parse(newBooking.service.addons) : [],
      },
      depositAmount,
      remainingAmount,
      fifoInfo: {
        queueTicket,
        assignedBay,
        isShopFull,
        totalActiveCarsInShop,
        maxShopCapacity: MAX_GLOBAL_SHOP_CAPACITY,
      },
    };

    return res.status(201).json(formattedBooking);
  } catch (error) {
    console.error('Error creating pending deposit booking:', error);
    return res.status(500).json({ error: 'Failed to create booking' });
  }
});

export default router;
