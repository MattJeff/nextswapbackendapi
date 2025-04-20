import { supabase } from '../config/supabase';
import { ApiError } from '../utils/AppError';

export async function getUserByIdService(id: string) {
  console.log('[SERVICE] getUserByIdService called with id:', id);
  const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
  if (error) {
  }
  console.log('[SERVICE] getUserByIdService returns:', data);
  return data;
}

export async function createUserService(userData: any) {
  // Log l'insertion
  console.log('[CREATE USER SERVICE] Inserting profile:', userData);
  const { data, error } = await supabase.from('profiles').insert([userData]).single();
  console.log('[CREATE USER SERVICE] Supabase insert result:', { data, error });
  if (error) {
    console.error('[CREATE USER ERROR]', error, userData);
    throw new ApiError(400, `[SUPABASE] ${error.message} | code: ${error.code} | details: ${error.details}`);
  }
  if (!data) {
    throw new ApiError(500, '[SUPABASE] Insert failed silently: no data and no error returned.');
  }
  console.log('[SERVICE] getUserByIdService returns:', data);
  return data;
}

export async function updateUserService(id: string, userData: any) {
  const { data, error } = await supabase.from('profiles').update(userData).eq('id', id).single();
  if (error) throw new ApiError(400, error.message);
  console.log('[SERVICE] getUserByIdService returns:', data);
  return data;
}

export async function deleteUserService(id: string) {
  const { error } = await supabase.from('profiles').delete().eq('id', id);
  if (error) throw new ApiError(400, error.message);
  return !error;
}

import { reverseGeocode } from '../utils/reverseGeocoding';

export async function searchUsersService(req: any) {
  // Préférence : récupère d'abord les filtres utilisateur
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  // Récupère les filtres personnalisés de l'utilisateur
  const { data: filters } = await supabase.from('user_filters').select('*').eq('user_id', userId).single();
  // Récupère la position courante de l'utilisateur
  const { data: me } = await supabase.from('profiles').select('location').eq('id', userId).single();

  // On permet d'override via query si besoin
  const {
    minAge = filters?.min_age,
    maxAge = filters?.max_age,
    language = filters?.language,
    nationality = filters?.nationality,
    sex = filters?.sex,
    radiusKm = filters?.radius_km || 50,
    page = '1',
    pageSize = '20'
  } = req.query;
  const pageNum = parseInt(page);
  const pageSz = parseInt(pageSize);
  const offset = (pageNum - 1) * pageSz;

  // Calcul des dates de naissance
  const today = new Date();
  let birthDateMin, birthDateMax;
  if (minAge) {
    birthDateMax = new Date(today.getFullYear() - parseInt(minAge), today.getMonth(), today.getDate()).toISOString().slice(0,10);
  }
  if (maxAge) {
    birthDateMin = new Date(today.getFullYear() - parseInt(maxAge) - 1, today.getMonth(), today.getDate() + 1).toISOString().slice(0,10);
  }

  let query = supabase.from('profiles').select('*', { count: 'exact' });
  if (language) query = query.overlaps('language', language);
  if (nationality) query = query.overlaps('nationality', nationality);
  if (sex) query = query.overlaps('sex', sex);
  if (birthDateMin) query = query.gte('birth_date', birthDateMin);
  if (birthDateMax) query = query.lte('birth_date', birthDateMax);
  query = query.neq('id', userId);

  // Exclure les utilisateurs bloqués
  const { data: blocked } = await supabase.from('blocks').select('blocked_id').eq('blocker_id', userId);
  const blockedIds = blocked?.map((b: any) => b.blocked_id) || [];
  if (blockedIds.length > 0) query = query.not('id', 'in', `(${blockedIds.join(',')})`);

  // Filtre géospatial : rayon autour de la position courante
  if (me?.location) {
    const radiusMeters = parseFloat(radiusKm) * 1000;
    query = query.filter('location', 'st_dwithin', `${me.location},${radiusMeters}`);
  }

  query = query.range(offset, offset + pageSz - 1);
  const { data, error, count } = await query;
  if (error) throw new ApiError(400, error.message);
  // Ajoute l'adresse humaine à chaque utilisateur si localisation présente
  const resultsWithAddress = await Promise.all((data || []).map(async (user: any) => {
    if (user.location && typeof user.location === 'string') {
      // location format: 'SRID=4326;POINT(lng lat)'
      const match = user.location.match(/POINT\(([-\d\.]+) ([-\d\.]+)\)/);
      if (match) {
        const lng = parseFloat(match[1]);
        const lat = parseFloat(match[2]);
        user.address = await reverseGeocode(lat, lng);
      } else {
        user.address = null;
      }
    } else {
      user.address = null;
    }
    return user;
  }));
  return { results: resultsWithAddress, page: pageNum, pageSize: pageSz, total: count };
}

