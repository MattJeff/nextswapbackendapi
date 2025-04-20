import request from 'supertest';
import app from '../src/app';
import { createSupabaseTestUser } from './supabase-auth.test-utils';

describe('Conversation & Messaging API', () => {
  let user1: any, user2: any, jwt1: string, jwt2: string, conversationId: string, messageId: string;

  beforeAll(async () => {
    user1 = await createSupabaseTestUser();
    user2 = await createSupabaseTestUser();
    jwt1 = user1.jwt;
    jwt2 = user2.jwt;
  });

  it('should create a conversation between two friends', async () => {
    const res = await request(app)
      .post(`/api/v1/conversations/${user2.userId}`)
      .set('Authorization', `Bearer ${jwt1}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBeDefined();
    conversationId = res.body.id;
  });

  it('should send a text message', async () => {
    const res = await request(app)
      .post(`/api/v1/conversations/${conversationId}/messages`)
      .set('Authorization', `Bearer ${jwt1}`)
      .send({ type: 'text', content: 'Hello 👋' });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    messageId = res.body.id;
  });

  it('should retrieve messages in the conversation', async () => {
    const res = await request(app)
      .get(`/api/v1/conversations/${conversationId}/messages`)
      .set('Authorization', `Bearer ${jwt1}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].content).toBe('Hello 👋');
  });

  it('should soft-delete a message', async () => {
    const res = await request(app)
      .delete(`/api/v1/conversations/messages/${messageId}`)
      .set('Authorization', `Bearer ${jwt1}`);
    expect(res.status).toBe(204);
  });

  it('should send an image message (mocked url)', async () => {
    const res = await request(app)
      .post(`/api/v1/conversations/${conversationId}/messages`)
      .set('Authorization', `Bearer ${jwt1}`)
      .send({ type: 'image', url: 'https://example.com/image.png' });
    expect(res.status).toBe(201);
    expect(res.body.type).toBe('image');
  });

  it('should start and end a video call', async () => {
    // Start
    const start = await request(app)
      .post(`/api/v1/conversations/${conversationId}/video-call/start`)
      .set('Authorization', `Bearer ${jwt1}`)
      .send({ callee_id: user2.userId });
    expect(start.status).toBe(201);
    expect(start.body.room_url).toContain('videosdk');
    const callId = start.body.id;
    // End
    const end = await request(app)
      .post(`/api/v1/conversations/video-call/${callId}/end`)
      .set('Authorization', `Bearer ${jwt1}`);
    expect(end.status).toBe(204);
  });
});
