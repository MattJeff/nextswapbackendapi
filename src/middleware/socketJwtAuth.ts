import jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';

export function socketJwtAuthMiddleware(socket: Socket, next: (err?: Error) => void) {
  const token = socket.handshake.auth?.token || socket.handshake.query?.token;
  if (!token) {
    return next(new Error('Authentication error: No token'));
  }
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET!);
    // @ts-ignore
    socket.user = user;
    next();
  } catch (err) {
    next(new Error('Authentication error: Invalid token'));
  }
}
