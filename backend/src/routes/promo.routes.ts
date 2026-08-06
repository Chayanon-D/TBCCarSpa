import { Router, Request, Response } from 'express';
import { prisma } from '../db/prisma.js';

const router = Router();

// GET /api/promotions - Get active promotion coupons
router.get('/promotions', async (_req: Request, res: Response) => {
  try {
    const coupons = await prisma.promotionCoupon.findMany();
    return res.json(coupons);
  } catch (error) {
    console.error('Error fetching promotions:', error);
    return res.status(500).json({ error: 'Failed to fetch promotions' });
  }
});

// GET /api/notifications - Get user notifications
router.get('/notifications', async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    const whereCondition = userId ? { userId: String(userId) } : {};

    const notifications = await prisma.notification.findMany({
      where: whereCondition,
      orderBy: { createdAt: 'desc' },
    });

    return res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

export default router;
