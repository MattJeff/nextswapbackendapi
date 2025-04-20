import request from 'supertest';
import app from '../src/app';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

const getAuthHeader = (userId: string) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '1h' });
  return { Authorization: `Bearer ${token}` };
};

describe('POST /video/room (erreur)', () => {
  it('should return 400 if payload is missing', async () => {
    const res = await request(app)
      .post('/api/video/room')
      .set(getAuthHeader('userTest'))
      .send({});
    expect(res.statusCode).toBe(400);
  });
});
