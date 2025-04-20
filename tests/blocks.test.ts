import request from 'supertest';
import app from '../src/app';

describe('Blocks API', () => {
  it('should reject unauthenticated block requests', async () => {
    const res = await request(app)
      .post('/api/v1/blocks/00000000-0000-0000-0000-000000000002');
    expect(res.status).toBe(401);
  });

  // More tests: block, unblock, list blocked users, etc.
});
