import { Server, Socket } from 'socket.io';

export function registerVideoChatSocket(io: Server) {
  // Namespace or room for video ephemeral chat
  io.on('connection', (socket: Socket) => {
    // When joining a video ephemeral chat room
    socket.on('video-chat:join', (roomId: string) => {
      socket.join(roomId);
    });

    // Handle sending a message to the room
    socket.on('video-chat:message', (data: { roomId: string; userId: string; content: string }) => {
      // Broadcast to all in the room except sender
      socket.to(data.roomId).emit('video-chat:message', {
        userId: data.userId,
        content: data.content,
        timestamp: Date.now()
      });
    });

    // Optionally handle leaving the room
    socket.on('video-chat:leave', (roomId: string) => {
      socket.leave(roomId);
    });
  });
}
