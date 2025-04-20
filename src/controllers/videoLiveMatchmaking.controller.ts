// Proxy controller for backward compatibility with videoLiveMatchmaking.routes.ts
// Redirige vers le vrai contrôleur matchmaking (live.controller)

export { 
  joinMatchmaking, 
  nextMatchmaking, 
  leaveMatchmaking, 
  getCurrentMatchmakingSession 
} from '../matchmaking/controllers/live.controller';
