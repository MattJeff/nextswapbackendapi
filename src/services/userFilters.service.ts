import { supabase } from '../config/supabase';
import { ApiError } from '../utils/AppError';

export async function getUserFilters(userId: string) {
  const { data, error } = await supabase.from('user_filters').select('*').eq('user_id', userId).single();
  if (error && error.code !== 'PGRST116') throw new ApiError(400, error.message);
  return data;
}

export async function updateUserFilters(userId: string, filters: any) {
  const { data, error } = await supabase
    .from('user_filters')
    .upsert([{ user_id: userId, ...filters }], { onConflict: 'user_id' })
    .select('*')
    .single();
  if (error) throw new ApiError(400, error.message);
  return data;
}
