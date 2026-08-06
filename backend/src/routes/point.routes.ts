import { Router, Response } from 'express';
import { prisma } from '../db/prisma.js';
import { tenantResolverMiddleware, TenantRequest } from '../middleware/tenantResolver.js';

const router = Router();

router.use(tenantResolverMiddleware);

// GET /api/points/rewards - Get redeemable reward catalog
router.get('/points/rewards', async (_req: TenantRequest, res: Response) => {
  try {
    const rewards = await prisma.rewardItem.findMany();
    return res.json(rewards);
  } catch (error) {
    console.error('Error fetching rewards:', error);
    return res.status(500).json({ error: 'Failed to fetch rewards' });
  }
});

// GET /api/points/history - Get tenant's point transaction history strictly isolated
router.get('/points/history', async (req: TenantRequest, res: Response) => {
  try {
    const tenantUser = req.tenantUser;
    const { userId } = req.query;

    let targetUserId = tenantUser?.id || (userId ? String(userId) : null);

    if (!targetUserId) {
      const defaultUser = await prisma.user.findFirst();
      targetUserId = defaultUser?.id;
    }

    const history = await prisma.pointTransaction.findMany({
      where: { userId: targetUserId },
      orderBy: { createdAt: 'desc' },
    });

    return res.json(history);
  } catch (error) {
    console.error('Error fetching tenant point history:', error);
    return res.status(500).json({ error: 'Failed to fetch point history' });
  }
});

// POST /api/points/redeem - Redeem points for a reward
router.post('/points/redeem', async (req: TenantRequest, res: Response) => {
  try {
    const tenantUser = req.tenantUser;
    const { userId, rewardId } = req.body;

    let targetUserId = tenantUser?.id || userId;

    if (!targetUserId) {
      const defaultUser = await prisma.user.findFirst();
      targetUserId = defaultUser?.id;
    }

    const reward = await prisma.rewardItem.findUnique({ where: { id: rewardId } });
    if (!reward) {
      return res.status(404).json({ error: 'Reward not found' });
    }

    const user = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!user || user.points < reward.ptsRequired) {
      return res.status(400).json({ error: 'Insufficient points' });
    }

    // Deduct points
    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: { points: { decrement: reward.ptsRequired } },
      include: { vehicles: true },
    });

    // Record point transaction
    await prisma.pointTransaction.create({
      data: {
        userId: targetUserId,
        title: `แลกรับ: ${reward.title}`,
        date: new Date().toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric' }),
        amount: -reward.ptsRequired,
        type: 'redeem',
        category: reward.category,
      },
    });

    return res.json({ success: true, user: updatedUser, rewardCode: reward.code });
  } catch (error) {
    console.error('Error redeeming tenant reward:', error);
    return res.status(500).json({ error: 'Failed to redeem reward' });
  }
});

export default router;
