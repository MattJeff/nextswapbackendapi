import { Request, Response, NextFunction } from 'express';
import { getMyProfileService, updateMyProfileService, getProfileByIdService, uploadProfilePhotoService } from '../services/profile.service';
import { ApiError } from '../utils/AppError';

interface AuthRequest extends Request {
  user?: { id: string };
  file?: Express.Multer.File;
}

export const getMyProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) throw new ApiError(401, 'Unauthorized');
    const profile = await getMyProfileService(req.user.id);
    res.json(profile);
  } catch (error: any) {
    if (error) {
    next(error);
  } else {
    next(new ApiError(500, 'Unknown error'));
  }
  }
};

export const updateMyProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) throw new ApiError(401, 'Unauthorized');
    const updated = await updateMyProfileService(req.user.id, req.body);
    res.json(updated);
  } catch (error: any) {
    if (error) {
    next(error);
  } else {
    next(new ApiError(500, 'Unknown error'));
  }
  }
};

export const getProfileById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const profile = await getProfileByIdService(req.params.userId);
    res.json(profile);
  } catch (error: any) {
    if (error) {
    next(error);
  } else {
    next(new ApiError(500, 'Unknown error'));
  }
  }
};

export const uploadProfilePhoto = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) throw new ApiError(401, 'Unauthorized');
    if (!req.file) throw new ApiError(400, 'No file uploaded');
    const photo_url = await uploadProfilePhotoService(req.user.id, req.file);
    res.status(201).json({ photo_url });
  } catch (error: any) {
    if (error) {
    next(error);
  } else {
    next(new ApiError(500, 'Unknown error'));
  }
  }
};
