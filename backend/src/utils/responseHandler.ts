import { Response } from 'express';

export interface EnterpriseSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
  timestamp: string;
}

export interface EnterpriseErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200
): Response {
  const response: EnterpriseSuccessResponse<T> = {
    success: true,
    data,
    ...(message ? { message } : {}),
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(response);
}

export function sendError(
  res: Response,
  message: string = 'Internal Server Error',
  statusCode: number = 500,
  errorCode: string = 'INTERNAL_ERROR',
  details?: any
): Response {
  const response: EnterpriseErrorResponse = {
    success: false,
    error: {
      code: errorCode,
      message,
      ...(details ? { details } : {}),
    },
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(response);
}
