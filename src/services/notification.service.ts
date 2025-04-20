// Service de notifications temps réel (WebSocket ou Supabase Realtime)
// Ici, version WebSocket simple (Socket.IO)
import { Server as SocketIOServer } from 'socket.io';
import { socketJwtAuthMiddleware } from '../middleware/socketJwtAuth';

let io: SocketIOServer | null = null;

export function initNotificationService(server: any) {
  io = new SocketIOServer(server, { cors: { origin: '*' } });
  io.use(socketJwtAuthMiddleware);
  io.on('connection', (socket: import('socket.io').Socket) => {
    // L'utilisateur authentifié est accessible via socket.user
    socket.on('join', (userId: string) => {
      socket.join(userId); // chaque user dans sa room
    });
  });
}

export function sendNotification(userId: string, payload: any) {
  if (io) {
    io.to(userId).emit('notification', payload);
  }
}
