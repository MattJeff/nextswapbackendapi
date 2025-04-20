import request from 'supertest';
import app from '../src/app';
jest.mock('../src/services/notification.service', () => ({ sendNotification: jest.fn() }));

describe('API Webhook Endpoints', () => {
  it('POST /webhook/videosdk - meeting.ended', async () => {
    const res = await request(app)
      .post('/api/webhook/videosdk')
      .send({ event: 'meeting.ended', roomId: 'room1', users: ['user1', 'user2'] });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('received', true);
  });
  it('POST /webhook/videosdk - recording.started', async () => {
    const res = await request(app)
      .post('/api/webhook/videosdk')
      .send({ event: 'recording.started', roomId: 'room1', users: ['user1'], recordingId: 'rec1' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('received', true);
  });
});
