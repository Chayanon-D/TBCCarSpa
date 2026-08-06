import { Request, Response, NextFunction } from 'express';

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  const { method, originalUrl } = req;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const emoji = status >= 500 ? '💥' : status >= 400 ? '⚠️' : '⚡';
    console.log(`${emoji} [${new Date().toISOString()}] ${method} ${originalUrl} ${status} - ${duration}ms`);
  });

  next();
}
