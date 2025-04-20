import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabaseClient';
import { ApiError } from '../utils/ApiError';
import { updateProfileSchema } from '../middleware/validateProfile';

export const getMyProfile = async (req: any, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  if (!userId) return next(new ApiError(401, 'Unauthorized'));
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
  if (error || !data) return next(new ApiError(404, 'Profile not found'));
  res.json(data);
};

export const updateMyProfile = async (req: any, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  if (!userId) return next(new ApiError(401, 'Unauthorized'));
  const parse = updateProfileSchema.safeParse(req.body);
  if (!parse.success) return next(new ApiError(400, 'Invalid profile update data'));
  const updates: any = { ...parse.data };
  // Handle geolocation
  if (updates.latitude !== undefined && updates.longitude !== undefined) {
    updates.location = `SRID=4326;POINT(${updates.longitude} ${updates.latitude})`;
    delete updates.latitude;
    delete updates.longitude;
  }
  const { data, error } = await supabase.from('profiles').update(updates).eq('id', userId).select('*').single();
  if (error || !data) return next(new ApiError(400, 'Update failed'));
  res.json(data);
};

export const getProfileById = async (req: any, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
  if (error || !data) return next(new ApiError(404, 'Profile not found'));
  res.json(data);
};

export const uploadProfilePhoto = async (req: any, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  if (!userId) return next(new ApiError(401, 'Unauthorized'));
  if (!req.file) return next(new ApiError(400, 'No file uploaded'));
  const file = req.file;
  const ext = file.originalname.split('.').pop();
  const path = `${userId}/profile.${ext}`;
  const { error: uploadError } = await supabase.storage.from('profile_photos').upload(path, file.buffer, { upsert: true, contentType: file.mimetype });
  if (uploadError) return next(new ApiError(400, uploadError.message));
  // Get public URL or signed URL (for private bucket)
  const { data: urlData } = supabase.storage.from('profile_photos').getPublicUrl(path);
  const photo_url = urlData?.publicUrl;
  await supabase.from('profiles').update({ photo_url }).eq('id', userId);
  res.status(201).json({ photo_url });
};
