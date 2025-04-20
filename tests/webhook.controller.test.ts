import request from 'supertest';
jest.mock('../src/services/notification.service', () => ({ sendNotification: jest.fn() }));
jest.mock('../src/config/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    insert: jest.fn().mockResolvedValue({ error: null })
  }
}));
import app from '../src/app';
describe('POST /webhook/videosdk', () => {
  it('should handle meeting.ended event', async () => {
    const res = await request(app)
      .post('/api/webhook/videosdk')
      .send({ event: 'meeting.ended', roomId: 'room1', users: ['user1', 'user2'] });
    expect(res.statusCode).toBe(200);
  });
  it('should handle recording.started event', async () => {
    const res = await request(app)
      .post('/api/webhook/videosdk')
      .send({ event: 'recording.started', roomId: 'room1', users: ['user1'], recordingId: 'rec1' });
    expect(res.statusCode).toBe(200);
  });
});
