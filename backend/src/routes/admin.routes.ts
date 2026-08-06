import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../db/prisma.js';

const router = Router();

// Middleware: AWS IAM & Cognito Style Security Guard
const adminAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const lineUserIdHeader = (req.headers['x-line-user-id'] as string) || (req.query.lineUserId as string) || '';
  const rawEnv = process.env.ADMIN_LINE_USER_IDS || '';
  const allowedAdminIds = rawEnv
    .split(',')
    .map((id) => id.replace(/["'\s]/g, '').trim())
    .filter(Boolean);

  const cleanHeaderId = lineUserIdHeader.replace(/["'\s]/g, '').trim();

  // Strict check: Only grant access if LINE User ID is present in ADMIN_LINE_USER_IDS
  if (allowedAdminIds.length > 0 && !allowedAdminIds.includes('*')) {
    if (!cleanHeaderId || !allowedAdminIds.includes(cleanHeaderId)) {
      console.warn(`⛔ [IAM Security Guard] Blocked unauthorized request from LINE User ID: ${cleanHeaderId || 'UNKNOWN'}`);
      return res.status(403).json({
        error: '403 Forbidden: IAM Security Authorization Failed',
        message: 'เฉพาะบัญชี LINE เจ้าของร้านที่ลงทะเบียนในระบบเท่านั้นที่สามารถเข้าถึงข้อมูลแผงควบคุมนี้ได้',
      });
    }
  }

  return next();
};

// Apply IAM Security Guard to all admin routes
router.use('/admin', adminAuthMiddleware);

// GET /api/admin/analytics - Performance and revenue overview
router.get('/admin/analytics', async (_req: Request, res: Response) => {
  try {
    const totalBookings = await prisma.booking.count();
    const completedBookings = await prisma.booking.count({ where: { status: 'Completed' } });
    const inProgressBookings = await prisma.booking.count({ where: { status: 'In Progress' } });
    const confirmedBookings = await prisma.booking.count({ where: { status: 'Confirmed' } });

    const revenueResult = await prisma.booking.aggregate({
      _sum: { totalAmount: true },
    });
    const totalRevenue = revenueResult._sum.totalAmount || 0;

    const services = await prisma.spaService.findMany({
      include: {
        _count: {
          select: { bookings: true },
        },
      },
    });

    const serviceBreakdown = services.map((s) => ({
      id: s.id,
      name: s.name,
      count: s._count.bookings,
      revenue: s._count.bookings * s.priceTHB,
    }));

    return res.json({
      totalRevenue,
      totalBookings,
      completedBookings,
      inProgressBookings,
      confirmedBookings,
      serviceBreakdown,
    });
  } catch (error) {
    console.error('Error fetching admin analytics:', error);
    return res.status(500).json({ error: 'Failed to fetch admin analytics' });
  }
});

// PUT /api/admin/car-status - Real-time car progress step update for specific booking
router.put('/admin/car-status', async (req: Request, res: Response) => {
  try {
    const { bookingId, currentStep, bayNumber, technicianName, estimatedFinishTime } = req.body;

    if (!bookingId || !currentStep) {
      return res.status(400).json({ error: 'bookingId and currentStep are required' });
    }

    // Find target booking with vehicle & service details
    const targetBooking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { vehicle: true, service: true, branch: true },
    });

    if (!targetBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const liveStatus = await prisma.carLiveStatus.findUnique({
      where: { bookingId },
    });

    // Update booking status to In Progress
    if (targetBooking.status !== 'Completed') {
      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'In Progress' },
      });
    }

    if (!liveStatus) {
      const created = await prisma.carLiveStatus.create({
        data: {
          bookingId,
          currentStep: Number(currentStep),
          bayNumber: bayNumber || 'Bay 01 (Detailing Zone)',
          technicianName: technicianName || 'ทีมงาน Master Detailer',
          estimatedFinishTime: estimatedFinishTime || '17:00 น.',
          photoProgressUrl: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&q=80&w=600',
          stages: JSON.stringify([
            { step: 1, title: '1. กำลังรอ (Queued)', subtitle: 'รับรถและตรวจสภาพ 12 จุด', status: currentStep >= 1 ? (currentStep === 1 ? 'current' : 'completed') : 'upcoming', time: '14:00 น.' },
            { step: 2, title: '2. กำลังล้าง (Washing)', subtitle: 'ฉีดโฟม pH-Neutral + ลูบดินน้ำมัน', status: currentStep >= 2 ? (currentStep === 2 ? 'current' : 'completed') : 'upcoming', time: '14:30 น.' },
            { step: 3, title: '3. กำลังขัด & เคลือบ (Polishing)', subtitle: 'ขัดชักเงาละเอียด + ลง Glass Coating', status: currentStep >= 3 ? (currentStep === 3 ? 'current' : 'completed') : 'upcoming', time: '15:10 น.' },
            { step: 4, title: '4. ตรวจ QC (Inspection)', subtitle: 'ตรวจความเรียบร้อย 24 จุด', status: currentStep >= 4 ? (currentStep === 4 ? 'current' : 'completed') : 'upcoming', time: '16:00 น.' },
            { step: 5, title: '5. เสร็จแล้ว พร้อมรับรถ (Ready)', subtitle: 'จอดรอที่โซน VIP Lounge', status: currentStep === 5 ? 'completed' : 'upcoming', time: '16:30 น.' },
          ]),
        },
        include: {
          booking: {
            include: { vehicle: true, service: true, branch: true },
          },
        },
      });

      return res.json({
        ...created,
        vehicle: targetBooking.vehicle,
        serviceName: targetBooking.service.name,
        branchName: targetBooking.branch.name,
      });
    }

    const currentStages = JSON.parse(liveStatus.stages);
    const updatedStages = currentStages.map((stg: any) => ({
      ...stg,
      status: stg.step < Number(currentStep) ? 'completed' : stg.step === Number(currentStep) ? 'current' : 'upcoming',
    }));

    const updated = await prisma.carLiveStatus.update({
      where: { bookingId },
      data: {
        currentStep: Number(currentStep),
        bayNumber: bayNumber || liveStatus.bayNumber,
        technicianName: technicianName || liveStatus.technicianName,
        estimatedFinishTime: estimatedFinishTime || liveStatus.estimatedFinishTime,
        stages: JSON.stringify(updatedStages),
      },
      include: {
        booking: {
          include: { vehicle: true, service: true, branch: true },
        },
      },
    });

    return res.json({
      ...updated,
      vehicle: targetBooking.vehicle,
      serviceName: targetBooking.service.name,
      branchName: targetBooking.branch.name,
    });
  } catch (error) {
    console.error('Error updating car live status:', error);
    return res.status(500).json({ error: 'Failed to update car live status' });
  }
});

// PUT /api/admin/booking-status - Update booking status
router.put('/admin/booking-status', async (req: Request, res: Response) => {
  try {
    const { bookingId, status } = req.body;

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
      include: {
        service: true,
        vehicle: true,
        branch: true,
      },
    });

    return res.json(updatedBooking);
  } catch (error) {
    console.error('Error updating booking status:', error);
    return res.status(500).json({ error: 'Failed to update booking status' });
  }
});

export default router;
