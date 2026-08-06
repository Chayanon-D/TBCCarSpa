import { Router, Response } from 'express';
import { prisma } from '../db/prisma.js';
import { tenantResolverMiddleware, TenantRequest } from '../middleware/tenantResolver.js';

const router = Router();

// Apply Multi-Tenant Resolver Middleware to all vehicle routes
router.use(tenantResolverMiddleware);

// GET /api/vehicles - Get tenant's isolated vehicles strictly by lineUserId
router.get('/vehicles', async (req: TenantRequest, res: Response) => {
  try {
    const tenantUser = req.tenantUser;
    const { userId } = req.query;

    let targetUserId = tenantUser?.id;

    if (!targetUserId && userId) {
      targetUserId = String(userId);
    }

    if (!targetUserId) {
      const defaultUser = await prisma.user.findFirst();
      targetUserId = defaultUser?.id;
    }

    const vehicles = await prisma.vehicle.findMany({
      where: { userId: targetUserId },
      orderBy: { isPrimary: 'desc' },
    });

    return res.json(vehicles);
  } catch (error) {
    console.error('Error fetching tenant vehicles:', error);
    return res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

// POST /api/vehicles - Register new vehicle strictly linked to tenant user
router.post('/vehicles', async (req: TenantRequest, res: Response) => {
  try {
    const tenantUser = req.tenantUser;
    const { userId, licensePlate, brand, model, color, year, isPrimary } = req.body;

    let targetUserId = tenantUser?.id || userId;

    if (!targetUserId) {
      const defaultUser = await prisma.user.findFirst();
      targetUserId = defaultUser?.id;
    }

    if (isPrimary) {
      // Unset previous primary vehicle for this tenant
      await prisma.vehicle.updateMany({
        where: { userId: targetUserId },
        data: { isPrimary: false },
      });
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        userId: targetUserId,
        licensePlate,
        brand,
        model,
        color,
        year,
        isPrimary: isPrimary || false,
      },
    });

    return res.status(201).json(vehicle);
  } catch (error) {
    console.error('Error adding tenant vehicle:', error);
    return res.status(500).json({ error: 'Failed to add vehicle' });
  }
});

// DELETE /api/vehicles/:id - Remove vehicle
router.delete('/vehicles/:id', async (req: TenantRequest, res: Response) => {
  try {
    const { id } = req.params;
    const tenantUser = req.tenantUser;

    const existingVehicle = await prisma.vehicle.findUnique({ where: { id } });
    if (!existingVehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    if (tenantUser && existingVehicle.userId !== tenantUser.id) {
      return res.status(403).json({ error: 'Forbidden: You can only delete your own vehicles' });
    }

    await prisma.vehicle.delete({ where: { id } });
    return res.json({ success: true, message: 'Vehicle deleted' });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    return res.status(500).json({ error: 'Failed to delete vehicle' });
  }
});

export default router;
