import request from 'supertest';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import app from '../src/app';

dotenv.config({ path: '.env.test' });

const getAuthHeader = (userId: string) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '1h' });
  return { Authorization: `Bearer ${token}` };
};

jest.mock('../src/config/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    insert: jest.fn().mockResolvedValue({ error: null })
  }
}));

jest.mock('../src/controllers/moderation.controller', () => {
    const originalModule = jest.requireActual('../src/controllers/moderation.controller');
    return {
        ...originalModule,
        logActivity: jest.fn(), // Mock pour éviter les console.log
    };
});

describe.skip('POST /moderation/report', () => {
  it('should return 201 on valid report', async () => {
    const res = await request(app)
      .post('/api/moderation/report')
      .set(getAuthHeader('user1'))
      .send({ reporterId: 'user1', reportedUserId: 'user2', reason: 'spam' });
    expect(res.statusCode).toBe(201);
  });
});
