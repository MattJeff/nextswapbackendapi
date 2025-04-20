import { supabase } from '../config/supabase';
import { ApiError } from '../utils/AppError';

export async function getMyProfileService(userId: string) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
  if (error || !data) throw new ApiError(404, 'Profile not found');
  return data;
}

export async function updateMyProfileService(userId: string, updates: any) {
  if (updates.latitude !== undefined && updates.longitude !== undefined) {
    updates.location = `SRID=4326;POINT(${updates.longitude} ${updates.latitude})`;
    delete updates.latitude;
    delete updates.longitude;
  }
  const { data, error } = await supabase.from('profiles').update(updates).eq('id', userId).select('*').single();
  if (error || !data) throw new ApiError(400, error?.message || 'Update failed');
  return data;
}

export async function getProfileSummary(userId: string) {
  const { data, error } = await supabase.from('profiles')
    .select('id, username, photo_url, age, gender, address, nationality, language, bio, location')
    .eq('id', userId)
    .single();
  if (error || !data) throw new ApiError(404, 'Profile not found');
  return data;
}

export async function getProfileByIdService(userId: string) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
  if (error || !data) throw new ApiError(404, 'Profile not found');
  return data;
}

export async function uploadProfilePhotoService(userId: string, file: any) {
  if (!file) throw new ApiError(400, 'No file uploaded');
  const ext = file.originalname.split('.').pop();
  const path = `${userId}/profile.${ext}`;
  const { error: uploadError } = await supabase.storage.from('profile_photos').upload(path, file.buffer, { upsert: true, contentType: file.mimetype });
  if (uploadError) throw new ApiError(400, uploadError.message);
  const { data: urlData } = supabase.storage.from('profile_photos').getPublicUrl(path);
  const photo_url = urlData?.publicUrl;
  await supabase.from('profiles').update({ photo_url }).eq('id', userId);
  return photo_url;
}
