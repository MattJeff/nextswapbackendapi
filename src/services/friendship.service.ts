import { supabase } from '../config/supabase';
import { ApiError } from '../utils/AppError';
import { sendNotification } from './notification.service';

export async function sendFriendRequestService(userId: string, targetUserId: string) {
  if (userId === targetUserId) throw new ApiError(400, 'Cannot friend yourself');
  // Always order user_id_1 < user_id_2 for uniqueness
  const [user_id_1, user_id_2] = userId < targetUserId ? [userId, targetUserId] : [targetUserId, userId];
  // Check if already friends or pending
  const { data: existing, error: findErr } = await supabase
    .from('friendships')
    .select('*')
    .eq('user_id_1', user_id_1)
    .eq('user_id_2', user_id_2)
    .single();
  if (existing) {
  // Succès idempotent : déjà ami ou demande existante
  return { alreadyExists: true };
}
  // Insert pending request
  const status = userId === user_id_1 ? 'pending' : 'pending';
  console.info('[DEBUG FRIENDSHIP INSERT] user_id_1:', user_id_1, 'user_id_2:', user_id_2);
  const { error } = await supabase
    .from('friendships')
    .insert([{ user_id_1, user_id_2, status }]);
  if (error) {
    console.error('[DEBUG FRIENDSHIP INSERT]', error);
    throw new ApiError(400, error.message);
  }
}

export async function acceptFriendRequestService(userId: string, fromUserId: string) {
  const [user_id_1, user_id_2] = userId < fromUserId ? [userId, fromUserId] : [fromUserId, userId];
  const { data, error } = await supabase
    .from('friendships')
    .update({ status: 'accepted' })
    .eq('user_id_1', user_id_1)
    .eq('user_id_2', user_id_2)
    .eq('status', 'pending')
    .select();
  if (error || !data || data.length === 0) throw new ApiError(404, 'No pending friend request found');
  // Notifier l'expéditeur que sa demande a été acceptée
  await sendNotification(fromUserId, { type: 'friend_request_accepted', from: userId });
}

export async function removeFriendService(userId: string, targetUserId: string) {
  const [user_id_1, user_id_2] = userId < targetUserId ? [userId, targetUserId] : [targetUserId, userId];
  const { error } = await supabase
    .from('friendships')
    .delete()
    .eq('user_id_1', user_id_1)
    .eq('user_id_2', user_id_2);
  if (error) throw new ApiError(400, error.message);
}

export async function listFriendsService(userId: string) {
  // Find all accepted friendships
  const { data, error } = await supabase
    .from('friendships')
    .select('*')
    .or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`)
    .eq('status', 'accepted');
  if (error) throw new ApiError(400, error.message);
  // Get friend IDs
  const friendIds = data?.map((f: any) => f.user_id_1 === userId ? f.user_id_2 : f.user_id_1) || [];
  if (friendIds.length === 0) return [];
  // Fetch profiles
  const { data: profiles, error: profErr } = await supabase.from('profiles').select('*').in('id', friendIds);
  if (profErr) throw new ApiError(400, profErr.message);
  return profiles;
}

export async function listPendingRequestsService(userId: string) {
  // Requests where user is the recipient
  const { data, error } = await supabase
    .from('friendships')
    .select('*')
    .or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`)
    .eq('status', 'pending');
  if (error) throw new ApiError(400, error.message);
  return data;
}
