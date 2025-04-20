import request from 'supertest';
import app from '../src/app';
import { supabaseTestClient } from './supabase-client.test-utils';

/**
 * Crée un utilisateur de test réel sur Supabase et récupère son JWT.
 * Retourne { userId, jwt, email, password }
 */
export async function createSupabaseTestUser(suffix = '') {
  const email = `testuser${Date.now()}${Math.floor(Math.random()*1e9)}@testmail.com`;
  const password = 'TestPassword123!';

  // Inscription
  const signupRes = await request(app)
    .post('/api/v1/auth/signup')
    .send({
      email,
      password,
      username: `user_${Math.floor(Math.random()*1e6)}`,
      birth_date: '1990-01-01',
      language: 'fr',
      nationality: 'FR'
    });

  let userId: string | undefined = undefined;
  if (signupRes.body && signupRes.body.user && signupRes.body.user.id) {
    userId = signupRes.body.user.id;
  } else if (signupRes.body && signupRes.body.userId) {
    userId = signupRes.body.userId;
  }
  if (!userId) {
    console.error('Signup failed, response body:', signupRes.body);
    throw new Error('Signup failed: ' + JSON.stringify(signupRes.body));
  }

  // Connexion
  const loginRes = await request(app)
    .post('/api/v1/auth/login')
    .send({ email, password });

  const jwt = loginRes.body.access_token || loginRes.body.accessToken;
  if (!jwt) {
    throw new Error('Login failed: ' + JSON.stringify(loginRes.body));
  }

  // Création automatique du profil (pour respecter la FK dans friendships)
  const { error: profileError } = await supabaseTestClient.from('profiles').insert({
    id: userId,
    email,
    username: `user_${Math.floor(Math.random()*1e6)}`,
    birth_date: '1990-01-01',
    language: 'fr',
    nationality: 'FR',
    created_at: new Date().toISOString()
  });
  if (profileError) {
    console.error('Profile insert error:', profileError);
    throw new Error('Profile insert failed: ' + profileError.message);
  }

  return { userId, jwt, email, password };
}

/**
 * Retourne un header d'authentification Bearer pour un JWT Supabase.
 */
export function getSupabaseAuthHeader(jwt: string) {
  return { Authorization: `Bearer ${jwt}` };
}
