import request from 'supertest';
import app from '../src/app';
import { createClient } from '@supabase/supabase-js';
import { config } from '../src/config';

let createdUserId: string;
let jwt: string;

const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);

const email = `testuser_${Date.now()}@example.com`;
const password = 'TestPassword123!';

let testUser: any = {
  username: 'testuser',
  birth_date: '2000-01-01',
  language: 'fr',
  nationality: 'FR',
};

describe('User creation and update', () => {
  beforeAll(async () => {
    // Signup via Supabase Auth
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    const { session, user } = data;
    if (session && session.access_token && user && user.id) {
      jwt = session.access_token;
      testUser = {
        ...testUser,
        id: user.id,
        email: user.email
      };
    } else {
      throw new Error('No JWT or user.id returned from Supabase signup');
    }
  });
  it('should create a user', async () => {
    const res = await request(app)
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${jwt}`)
      .send(testUser);
    console.log('CREATE USER status:', res.status, 'body:', res.body);
    if (res.status !== 201) {
      console.error('CREATE USER ERROR:', res.body);
    }
    expect(res.status).toBe(201);
    expect(res.body && res.body.id).toBeDefined();
    createdUserId = res.body && res.body.id;
  });

  it('should update the user', async () => {
    const res = await request(app)
      .put(`/api/v1/users/${createdUserId}`)
      .set('Authorization', `Bearer ${jwt}`)
      .send({ username: 'updateduser' });
    console.log('UPDATE USER status:', res.status, 'body:', res.body);
    expect(res.status).toBe(200);
    expect(res.body.username).toBe('updateduser');
  });
});
