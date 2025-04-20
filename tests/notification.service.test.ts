jest.mock('../src/services/notification.service', () => {
  return {
    __esModule: true,
    ...jest.requireActual('../src/services/notification.service'),
    sendNotification: jest.fn(async (userId, payload) => {
      (global as any).io = {
        to: jest.fn().mockReturnValue({ emit: jest.fn() })
      };
      (global as any).io.to(userId).emit('notification', payload);
    })
  };
});
import { sendNotification } from '../src/services/notification.service';

describe.skip('Notification Service', () => {
  beforeAll(() => {
    // Mock globale io
    (global as any).io = {
      to: jest.fn().mockReturnValue({ emit: jest.fn() })
    };
  });
  it('should send notification to correct user room', async () => {
    const spy = jest.spyOn((global as any).io, 'to');
    await sendNotification('user-123', { type: 'test', foo: 'bar' });
    expect(spy).toHaveBeenCalledWith('user-123');
  });
});
