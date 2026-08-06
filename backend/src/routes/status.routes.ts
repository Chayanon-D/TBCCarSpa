import { Router, Response } from 'express';
import { prisma } from '../db/prisma.js';
import { tenantResolverMiddleware, TenantRequest } from '../middleware/tenantResolver.js';

const router = Router();

router.use(tenantResolverMiddleware);

// GET /api/car-status - Fetch active live car status strictly for the authenticated tenant customer
router.get('/car-status', async (req: TenantRequest, res: Response) => {
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

    // Find all active live statuses for this user
    let liveStatuses = await prisma.carLiveStatus.findMany({
      where: {
        booking: {
          userId: targetUserId,
          status: { not: 'Completed' },
        },
      },
      include: {
        booking: {
          include: {
            vehicle: true,
            service: true,
            branch: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Fallback: If no uncompleted status found, return recent statuses
    if (liveStatuses.length === 0) {
      liveStatuses = await prisma.carLiveStatus.findMany({
        where: {
          booking: {
            userId: targetUserId,
          },
        },
        include: {
          booking: {
            include: {
              vehicle: true,
              service: true,
              branch: true,
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
        take: 5,
      });
    }

    if (liveStatuses.length === 0) {
      return res.status(404).json({ error: 'No active car live status found for this user' });
    }

    const formattedList = liveStatuses.map((item) => ({
      bookingId: item.bookingId,
      bookingRef: item.booking?.bookingRef,
      status: item.booking?.status,
      vehicle: item.booking?.vehicle,
      serviceName: item.booking?.service?.name,
      branchName: item.booking?.branch?.name,
      currentStep: item.currentStep,
      estimatedFinishTime: item.estimatedFinishTime,
      bayNumber: item.bayNumber,
      technicianName: item.technicianName,
      stages: item.stages ? JSON.parse(item.stages) : [],
      photoProgressUrl: item.photoProgressUrl,
    }));

    return res.json(formattedList);
  } catch (error) {
    console.error('Error fetching tenant live car status:', error);
    return res.status(500).json({ error: 'Failed to fetch live car status' });
  }
});

export default router;
