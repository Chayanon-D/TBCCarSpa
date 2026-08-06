import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/responseHandler.js';

export function globalErrorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response {
  console.error('💥 [Enterprise Error Handler] Unhandled Exception:', err);

  const statusCode = err.statusCode || err.status || 500;
  const errorCode = err.code || 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'เกิดข้อผิดพลาดภายในระบบ (Internal Server Error)';

  return sendError(res, message, statusCode, errorCode, process.env.NODE_ENV === 'development' ? err.stack : undefined);
}
