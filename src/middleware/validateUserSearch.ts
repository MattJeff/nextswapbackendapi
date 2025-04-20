import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ApiError } from '../utils/ApiError';

export const searchSchema = z.object({
  minAge: z.string().optional(),
  maxAge: z.string().optional(),
  language: z.string().optional(),
  nationality: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  radiusKm: z.string().optional(),
  page: z.string().optional(),
  pageSize: z.string().optional()
});

export function validateUserSearch(req: Request, res: Response, next: NextFunction) {
  const parse = searchSchema.safeParse(req.query);
  if (!parse.success) {
    return next(new ApiError(400, 'Invalid search parameters'));
  }
  next();
}
