import { Server } from 'socket.io';
import http from 'http';
import { registerVideoChatSocket } from './websocket/videoChatSocket';
import { registerMessageSocket } from './websocket/messageSocket';

let io: Server;

export function initSocket(server: http.Server) {
  console.log('[SOCKET] initSocket called');
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });
  io.on('connection', (socket) => {
    console.log('[SOCKET][connection] socket.id:', socket.id);
    socket.on('error', (err) => {
      console.error('[SOCKET][error]', err);
    });
    // User joins their user room for direct notifications
    socket.on('join', (userId: string) => {
      console.log('[SOCKET][join] userId:', userId, 'socket.id:', socket.id);
      socket.join(userId);
      // Log les rooms de cette socket après join
      setTimeout(() => {
        console.log('[SOCKET][join] Rooms for socket', socket.id, Array.from(socket.rooms));
      }, 100);
    });
  });
  // Enregistre le chat texte éphémère vidéo
  registerVideoChatSocket(io);
  registerMessageSocket(io);
}

export function emitToUser(userId: string, event: string, data: any) {
  if (io) {
    console.log('[SOCKET][emitToUser]', { userId, event, data });
    console.log('[SOCKET][emitToUser] Stack trace:', new Error().stack);
    // Log toutes les rooms existantes
    const allRooms = Array.from(io.sockets.adapter.rooms.keys());
    console.log('[SOCKET][emitToUser] All rooms:', allRooms);
    // Vérifie si la room existe
    if (allRooms.includes(userId)) {
      console.log(`[SOCKET][emitToUser] Room ${userId} found, emitting event.`);
    } else {
      console.warn(`[SOCKET][emitToUser] Room ${userId} NOT found!`);
    }
    io.to(userId).emit(event, data);
  }
}
