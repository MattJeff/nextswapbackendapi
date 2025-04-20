import app from './app';
import { initNotificationService } from './services/notification.service';
import { initSocket } from './socket';
import http from 'http';

const PORT = parseInt(process.env.PORT || '4000', 10);

const server = http.createServer(app);
initSocket(server);
initNotificationService(server);

console.log('[DEBUG] About to listen on port', PORT);
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
console.log('[DEBUG] Listen call done');
