import request from 'supertest';
import app from '../src/app';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

jest.mock('../src/services/video.service', () => ({
  createVideoRoomForMatch: jest.fn().mockResolvedValue({ roomId: 'dummy-room', tokens: { userA: 'tokenA', userB: 'tokenB' } })
}));

const getAuthHeader = (userId: string) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '1h' });
  return { Authorization: `Bearer ${token}` };
};

describe('POST /api/video/room', () => {
  it('should create a video room for two users and return tokens', async () => {
    const res = await request(app)
      .post('/api/video/room')
      .set(getAuthHeader('userA'))
      .send({ userA: 'userA', userB: 'userB' });
    expect(res.statusCode).toBe(201);
    expect(res.body.roomId).toBe('dummy-room');
    expect(res.body.tokens).toHaveProperty('userA');
    expect(res.body.tokens).toHaveProperty('userB');
  });
});
