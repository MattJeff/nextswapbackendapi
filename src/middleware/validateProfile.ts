import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { ApiError } from '../utils/AppError';
import { Multer } from 'multer';

export const updateProfileSchema = z.object({
  username: z.string().min(3).max(20).optional(),
  birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  language: z.string().min(2).optional(),
  nationality: z.string().min(2).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  is_available_for_matchmaking: z.boolean().optional()
});

export function validateUpdateProfile(req: Request, res: Response, next: NextFunction) {
  const parse = updateProfileSchema.safeParse(req.body);
  if (!parse.success) {
    return next(new ApiError(400, 'Invalid profile update data'));
  }
  next();
}

export const photoUploadSchema = z.object({
  file: z.any()
});

// Étend Request pour typer req.file (fourni par Multer)
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export function validatePhotoUpload(req: MulterRequest, res: Response, next: NextFunction) {
  if (!req.file) {
    return next(new ApiError(400, 'Photo file is required'));
  }
  // Optionally: check mimetype, size, etc.
  next();
}
