import { supabase } from '../config/supabase';
import { ApiError } from '../utils/AppError';
import { sendNotification } from './notification.service';

export async function requestMatchService(userId: string, filters: any) {
  // Exclure amis, bloqués, soi-même
  // Recherche simple d'un profil compatible (matchmaking avancé à faire plus tard)
  // On réutilise la logique de recherche utilisateurs, mais on retourne un seul résultat "compatible"
  // TODO: Améliorer la logique (filtrage avancé, gestion de la disponibilité, etc.)
  const { data: friends } = await supabase.from('friendships').select('*').or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`).eq('status', 'accepted');
  const friendIds = friends?.map((f: any) => f.user_id_1 === userId ? f.user_id_2 : f.user_id_1) || [];
  const { data: blocked } = await supabase.from('blocks').select('blocked_id').eq('blocker_id', userId);
  const blockedIds = blocked?.map((b: any) => b.blocked_id) || [];
  let query = supabase.from('profiles').select('*').neq('id', userId);
  if (filters.language) query = query.eq('language', filters.language);
  if (filters.nationality) query = query.eq('nationality', filters.nationality);
  if (friendIds.length > 0) query = query.not('id', 'in', `(${friendIds.join(',')})`);
  if (blockedIds.length > 0) query = query.not('id', 'in', `(${blockedIds.join(',')})`);
  // TODO: Ajouter la logique géospatiale si besoin
  const { data, error } = await query.limit(1);
  if (error || !data || data.length === 0) throw new ApiError(404, 'No match found');
  const match = data[0];
  // Notifier le match trouvé
  await sendNotification(match.id, { type: 'match_found', with: userId });
  return match;
}
