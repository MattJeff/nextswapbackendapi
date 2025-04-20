import request from 'supertest';
import app from '../src/app';

describe('Friendship API', () => {
  // TODO: Setup/teardown test DB or use Supabase test instance
  // TODO: Mock authentication middleware if needed

  it('should reject unauthenticated requests', async () => {
    const res = await request(app)
      .post('/api/v1/friendships/request/00000000-0000-0000-0000-000000000002');
    expect(res.status).toBe(401);
  });

  // More tests: success, duplicate request, accept, remove, etc.
});
