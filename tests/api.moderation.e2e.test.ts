import request from 'supertest';
import app from '../src/app';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

const getAuthHeader = (userId: string) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '1h' });
  return { Authorization: `Bearer ${token}` };
};

describe.skip('API Moderation Endpoints', () => {
  it('POST /moderation/report - succès', async () => {
    const res = await request(app)
      .post('/api/moderation/report')
      .set(getAuthHeader('user1')) 
      .send({ reporterId: 'user1', reportedUserId: 'user2', reason: 'spam' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message');
  });

  it('POST /moderation/report - erreur (payload manquant)', async () => {
    const res = await request(app)
      .post('/api/moderation/report')
      .set(getAuthHeader('userTest')) 
      .send({});
    expect(res.statusCode).toBe(400);
  });
});
