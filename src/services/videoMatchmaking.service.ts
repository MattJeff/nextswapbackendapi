import { supabase } from '../config/supabaseClient';
import { ApiError } from '../utils/ApiError';

export async function getNextVideoProfileService(userId: string, filters: any) {
  // Exclure amis, bloqués, soi-même, déjà vus (pour la session)
  // Recherche d'un profil compatible pour le matchmaking vidéo
  const { data: friends } = await supabase.from('friendships').select('*').or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`).eq('status', 'accepted');
  const friendIds = friends?.map((f: any) => f.user_id_1 === userId ? f.user_id_2 : f.user_id_1) || [];
  const { data: blocked } = await supabase.from('blocks').select('blocked_id').eq('blocker_id', userId);
  const blockedIds = blocked?.map((b: any) => b.blocked_id) || [];
  // TODO: Ajouter gestion des profils déjà vus (en session ou table dédiée)
  let query = supabase.from('profiles').select('*').neq('id', userId);
  if (filters.language) query = query.eq('language', filters.language);
  if (filters.nationality) query = query.eq('nationality', filters.nationality);
  if (filters.gender) query = query.eq('gender', filters.gender);
  if (filters.ageMin) query = query.gte('age', filters.ageMin);
  if (filters.ageMax) query = query.lte('age', filters.ageMax);
  if (friendIds.length > 0) query = query.not('id', 'in', `(${friendIds.join(',')})`);
  if (blockedIds.length > 0) query = query.not('id', 'in', `(${blockedIds.join(',')})`);
  // TODO: Ajouter la logique géospatiale si besoin (voir location dans profiles)
  const { data, error } = await query.limit(1);
  if (error || !data || data.length === 0) throw new ApiError(404, 'No video match found');
  return data[0];
}
