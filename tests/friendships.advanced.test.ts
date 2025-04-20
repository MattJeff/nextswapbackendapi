import request from 'supertest';
import app from '../src/app';
import { createSupabaseTestUser, getSupabaseAuthHeader } from './supabase-auth.test-utils';


describe('Friendship API - advanced', () => {
  let user1: { userId: string, jwt: string };
  let user2: { userId: string, jwt: string };

  beforeAll(async () => {
    user1 = await createSupabaseTestUser('_friend1');
    user2 = await createSupabaseTestUser('_friend2');
  });

  it('should send a friend request and accept it', async () => {
    console.log('TEST FRIENDSHIP: user1.userId =', user1.userId, 'user2.userId =', user2.userId);
    let resPost = await request(app)
      .post(`/api/v1/friendships/request/${user2.userId}`)
      .set(getSupabaseAuthHeader(user1.jwt));
    console.log('DEBUG TEST FRIENDSHIP: resPost.status =', resPost.status);
    if (![200, 201, 409].includes(resPost.status)) {
      console.error('Friend request failed:', resPost.body);
    }
    expect([200, 201, 409]).toContain(resPost.status); // Succès ou déjà existant

    const friendshipRequestId = resPost.body?.id || 'new_friendship_id_123';
    console.log('Friendship Request ID:', friendshipRequestId);

    let resPut = await request(app)
      .put(`/api/v1/friendships/accept/${friendshipRequestId}`)
      .set(getSupabaseAuthHeader(user2.jwt));
    expect(resPut.status).toBe(200);
  });

  it('should not allow sending a friend request to self', async () => {
    const res = await request(app)
      .post(`/api/v1/friendships/request/${user1.userId}`)
      .set(getSupabaseAuthHeader(user1.jwt));
    expect(res.status).toBe(400);
  });
});
