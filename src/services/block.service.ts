import { supabase } from '../config/supabase';
import { ApiError } from '../utils/AppError';

export async function blockUserService(blockerId: string, blockedId: string) {
  if (blockerId === blockedId) throw new ApiError(400, 'Cannot block yourself');
  const { error } = await supabase.from('blocks').insert([{ blocker_id: blockerId, blocked_id: blockedId }]);
  if (error) throw new ApiError(400, error.message);
}

export async function unblockUserService(blockerId: string, blockedId: string) {
  const { error } = await supabase.from('blocks').delete().eq('blocker_id', blockerId).eq('blocked_id', blockedId);
  if (error) throw new ApiError(400, error.message);
}

export async function listBlockedUsersService(blockerId: string) {
  const { data, error } = await supabase.from('blocks').select('blocked_id').eq('blocker_id', blockerId);
  if (error) throw new ApiError(400, error.message);
  return data?.map((b: any) => b.blocked_id) || [];
}
