import { Server, Socket } from 'socket.io';
import { supabase } from '../config/supabase';

export function registerLocationSocket(io: Server) {
  io.on('connection', (socket: Socket) => {
    socket.on('user:location:update', async (payload) => {
      // payload: { userId, lat, lng }
      const { userId, lat, lng } = payload;
      if (!userId || !lat || !lng) return;
      await supabase.from('profiles').update({
        location: `SRID=4326;POINT(${lng} ${lat})`,
        location_updated_at: new Date().toISOString(),
      }).eq('id', userId);
      // Optionally, emit to others that user moved
      socket.broadcast.emit('user:location:changed', { userId, lat, lng });
    });
  });
}
