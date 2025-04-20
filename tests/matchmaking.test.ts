import request from 'supertest';
import app from '../src/app';

describe('Matchmaking API', () => {
  it('should reject unauthenticated matchmaking requests', async () => {
    const res = await request(app)
      .post('/api/v1/matchmaking')
      .send({ language: 'fr', nationality: 'FR' });
    expect(res.status).toBe(401);
  });

  // More tests: successful match, no match found, etc.
});
