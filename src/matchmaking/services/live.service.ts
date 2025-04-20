// Service de matchmaking vidéo live (speed-dating)
// Déplacé depuis src/services/videoLiveMatchmaking.service.ts
import { v4 as uuidv4 } from 'uuid';
import { ApiError } from '../../utils/ApiError';

// Map userId -> sessionId
const activeUsers = new Map<string, string>();
// Map sessionId -> { user1, user2 }
const activeSessions = new Map<string, { user1: string, user2: string }>();
// Map userId -> Set des users déjà vus dans cette session
const seenUsers = new Map<string, Set<string>>();

export function resetLiveMatchmaking() {
  activeUsers.clear();
  activeSessions.clear();
  seenUsers.clear();
}

export function joinLiveMatchmaking(userId: string) {
  console.log(`[LIVE][DEBUG] joinLiveMatchmaking called for userId=${userId}`);
  if (!activeUsers.has(userId)) {
    activeUsers.set(userId, '');
    seenUsers.set(userId, new Set());
  }
  console.log(`[LIVE][DEBUG] activeUsers after join:`, Array.from(activeUsers.entries()));
}

export function leaveLiveMatchmaking(userId: string) {
  const sessionId = activeUsers.get(userId);
  if (sessionId && activeSessions.has(sessionId)) {
    const session = activeSessions.get(sessionId)!;
    activeSessions.delete(sessionId);
    if (session.user1 !== userId) activeUsers.set(session.user1, '');
    if (session.user2 !== userId) activeUsers.set(session.user2, '');
  }
  activeUsers.delete(userId);
  seenUsers.delete(userId);
}

export function nextLiveMatchmaking(userId: string): { partnerId: string, sessionId: string } | null {
  console.log(`[LIVE][DEBUG] nextLiveMatchmaking called for userId=${userId}`);
  console.log(`[LIVE][DEBUG] activeUsers before matching:`, Array.from(activeUsers.entries()));
  console.log(`[LIVE][DEBUG] activeSessions before matching:`, Array.from(activeSessions.entries()));

  // Retirer l'utilisateur de sa session actuelle
  const oldSessionId = activeUsers.get(userId);
  if (oldSessionId && activeSessions.has(oldSessionId)) {
    const session = activeSessions.get(oldSessionId)!;
    const other = session.user1 === userId ? session.user2 : session.user1;
    if (other) activeUsers.set(other, '');
    activeSessions.delete(oldSessionId);
  }
  // Chercher un autre utilisateur libre et non déjà vu
  let alreadySeen = seenUsers.get(userId);
  if (!alreadySeen || alreadySeen.size === 0) {
    alreadySeen = new Set();
    for (const [otherId, sess] of activeUsers.entries()) {
      if (otherId !== userId && sess === '') {
        const sessionId = uuidv4();
        activeSessions.set(sessionId, { user1: userId, user2: otherId });
        activeUsers.set(userId, sessionId);
        activeUsers.set(otherId, sessionId);
        alreadySeen.add(otherId);
        (seenUsers.get(otherId) || new Set()).add(userId);
        seenUsers.set(userId, alreadySeen);
        return { partnerId: otherId, sessionId };
      }
    }
  }
  // Sinon, comportement normal (évite les déjà vus)
  alreadySeen = seenUsers.get(userId) || new Set();
  for (const [otherId, sess] of activeUsers.entries()) {
    if (otherId !== userId && sess === '' && !(alreadySeen.has(otherId))) {
      const sessionId = uuidv4();
      activeSessions.set(sessionId, { user1: userId, user2: otherId });
      activeUsers.set(userId, sessionId);
      activeUsers.set(otherId, sessionId);
      alreadySeen.add(otherId);
      (seenUsers.get(otherId) || new Set()).add(userId);
      seenUsers.set(userId, alreadySeen);
      return { partnerId: otherId, sessionId };
    }
  }
  // Pas de partenaire dispo UNIQUEMENT si pas déjà en session
  if (!activeUsers.get(userId) || activeUsers.get(userId) === '') {
    activeUsers.set(userId, '');
  }
  return null;
}

export function getCurrentSession(userId: string) {
  const sessionId = activeUsers.get(userId);
  if (sessionId && activeSessions.has(sessionId)) {
    return { sessionId, ...activeSessions.get(sessionId)! };
  }
  return null;
}
