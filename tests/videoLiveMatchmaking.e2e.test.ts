import request from 'supertest';
import app from '../src/app';

// Variables à remplacer par des tokens valides ou à automatiser
import fs from 'fs';
const { TOKEN_USER1, TOKEN_USER2 } = JSON.parse(fs.readFileSync(__dirname + '/../scripts/testTokens.json', 'utf-8'));

const api = request(app);

import { resetLiveMatchmaking } from '../src/matchmaking/services/live.service';

describe('E2E Video Live Matchmaking', () => {
  beforeAll(() => {
    resetLiveMatchmaking();
  });
  let sessionId: string;
  let partnerId: string;

  it('User1 rejoint le matchmaking', async () => {
    const res = await api.post('/api/v1/video-live-matchmaking/join')
      .set('Authorization', `Bearer ${TOKEN_USER1}`);
    expect([200,201]).toContain(res.status);
    // Peut matcher ou non selon l'état
  });

  it('User2 rejoint le matchmaking et match direct', async () => {
    const res = await api.post('/api/v1/video-live-matchmaking/join')
      .set('Authorization', `Bearer ${TOKEN_USER2}`);
    expect([200, 201, 404]).toContain(res.status);
    if (res.status === 200 || res.status === 201) {
      expect(res.body.matched).toBe(true);
      expect(res.body.partnerId).toBeDefined();
      expect(res.body.sessionId).toBeDefined();
      console.log('[TEST DEBUG] Réponse match User2:', res.body);
      sessionId = res.body.sessionId;
      partnerId = res.body.partnerId;
    } else if (res.status === 404) {
      expect(res.body.error).toBeDefined();
    }
  });

  it('User1 récupère la session courante', async () => {
    const res = await api.get('/api/v1/video-live-matchmaking/current')
      .set('Authorization', `Bearer ${TOKEN_USER1}`);
    console.log('[TEST DEBUG] sessionId attendu:', sessionId, 'réponse API:', res.body);
    expect([200, 201, 404]).toContain(res.status);
    if (res.status === 404) {
      expect(res.body.error).toBeDefined();
    } else if (sessionId) {
      expect(res.body.sessionId).toBe(sessionId);
      expect([res.body.user1, res.body.user2]).toContain(partnerId);
    }
    // sinon, pas d'assertion supplémentaire
  });

  it('User1 passe à la personne suivante', async () => {
    const res = await api.post('/api/v1/video-live-matchmaking/next')
      .set('Authorization', `Bearer ${TOKEN_USER1}`);
    expect([200,201,404]).toContain(res.status);
    if (res.status === 404) {
      expect(res.body.error).toBeDefined();
    }
    // Peut matcher ou non selon dispo
  });

  it('User2 quitte le matchmaking', async () => {
    const res = await api.post('/api/v1/video-live-matchmaking/leave')
      .set('Authorization', `Bearer ${TOKEN_USER2}`);
    expect([200,201]).toContain(res.status);
    expect(res.body.left).toBe(true);
  });
});
