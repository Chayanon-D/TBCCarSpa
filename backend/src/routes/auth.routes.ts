import { Router, Response } from 'express';
import { prisma } from '../db/prisma.js';
import { tenantResolverMiddleware, TenantRequest } from '../middleware/tenantResolver.js';

const router = Router();

router.use(tenantResolverMiddleware);

// GET /api/user - Fetch isolated customer profile by lineUserId
router.get('/user', async (req: TenantRequest, res: Response) => {
  try {
    const tenantUser = req.tenantUser;

    if (tenantUser) {
      return res.json(tenantUser);
    }

    const defaultUser = await prisma.user.findFirst({
      include: {
        vehicles: true,
      },
    });

    if (!defaultUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json(defaultUser);
  } catch (error) {
    console.error('Error fetching tenant user:', error);
    return res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// POST /api/user/sync-liff - Sync profile from LINE LIFF authentication
router.post('/user/sync-liff', async (req: TenantRequest, res: Response) => {
  try {
    const { lineUserId, lineDisplayName, linePictureUrl, email } = req.body;
    const cleanLineUserId = lineUserId ? lineUserId.replace(/["'\s]/g, '').trim() : '';

    if (!cleanLineUserId) {
      const defaultUser = await prisma.user.findFirst({
        include: { vehicles: true },
      });
      return res.json(defaultUser);
    }

    let user = await prisma.user.findUnique({
      where: { lineUserId: cleanLineUserId },
      include: { vehicles: true },
    });

    if (user) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          lineDisplayName: lineDisplayName || user.lineDisplayName,
          linePictureUrl: linePictureUrl || user.linePictureUrl,
        },
        include: { vehicles: true },
      });
    } else {
      const shortId = Math.floor(10000 + Math.random() * 90000);
      user = await prisma.user.create({
        data: {
          lineUserId: cleanLineUserId,
          lineDisplayName: lineDisplayName || 'LINE Member',
          linePictureUrl: linePictureUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
          firstName: lineDisplayName?.split(' ')[0] || 'สมาชิก',
          lastName: lineDisplayName?.split(' ')[1] || 'LINE',
          email: email || 'user@line.me',
          memberId: `TBC-${shortId}`,
          memberLevel: 'Silver Member',
          points: 0,
          usageCount: 0,
        },
        include: { vehicles: true },
      });
    }

    return res.json(user);
  } catch (error) {
    console.error('Error syncing LIFF tenant user:', error);
    const defaultUser = await prisma.user.findFirst({ include: { vehicles: true } });
    return res.json(defaultUser);
  }
});

// PUT /api/user/update - Update personal user information
router.put('/user/update', async (req: TenantRequest, res: Response) => {
  try {
    const tenantUser = req.tenantUser;
    const { userId, firstName, lastName, phone, email, dob, province } = req.body;

    const targetUserId = tenantUser?.id || userId;

    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: {
        firstName,
        lastName,
        phone,
        email,
        dob,
        province,
      },
      include: { vehicles: true },
    });

    return res.json(updatedUser);
  } catch (error) {
    console.error('Error updating tenant user profile:', error);
    return res.status(500).json({ error: 'Failed to update user' });
  }
});

export default router;
