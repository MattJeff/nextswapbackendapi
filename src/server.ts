import app from './app';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { registerLocationSocket } from './websocket/locationSocket';

const PORT = process.env.PORT || 4000;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' }
});

registerLocationSocket(io);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server running on port ${PORT}`);
});
