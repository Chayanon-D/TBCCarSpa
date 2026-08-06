import { Request, Response, NextFunction } from 'express';
import { prisma } from '../db/prisma.js';

export interface TenantRequest extends Request {
  tenantUser?: any;
}

export async function tenantResolverMiddleware(
  req: TenantRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const lineUserIdHeader =
      (req.headers['x-line-user-id'] as string) ||
      (req.query.lineUserId as string) ||
      (req.body && req.body.lineUserId);

    if (lineUserIdHeader) {
      const cleanLineUserId = lineUserIdHeader.replace(/["'\s]/g, '').trim();

      if (cleanLineUserId) {
        // Find existing user or create clean profile for new LINE customer
        let user = await prisma.user.findUnique({
          where: { lineUserId: cleanLineUserId },
          include: { vehicles: true },
        });

        if (!user) {
          const shortId = Math.floor(10000 + Math.random() * 90000);
          user = await prisma.user.create({
            data: {
              lineUserId: cleanLineUserId,
              lineDisplayName: `คุณสมาชิก LINE (${cleanLineUserId.slice(0, 6)})`,
              firstName: 'สมาชิก',
              lastName: 'LINE',
              phone: '',
              email: '',
              dob: '',
              province: 'กรุงเทพมหานคร',
              memberId: `TBC-${shortId}`,
              memberLevel: 'Silver Member',
              points: 0,
              usageCount: 0,
              pdpaAccepted: true,
            },
            include: { vehicles: true },
          });
        }

        req.tenantUser = user;
      }
    }
  } catch (error) {
    console.error('Error resolving tenant in tenantResolverMiddleware:', error);
  } finally {
    next();
  }
}
