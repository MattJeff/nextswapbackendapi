import * as dotenv from 'dotenv';
dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });
import request from 'supertest';
import io, { Socket } from 'socket.io-client';

// Remplace par tes vrais tokens ou automatiser la création de users
import fs from 'fs';
const { TOKEN_USER1, TOKEN_USER2, USER1_ID, USER2_ID } = JSON.parse(fs.readFileSync(__dirname + '/../scripts/testTokens.json', 'utf-8'));

let conversationId: string;
let messageId: string;
let wsUser1: ReturnType<typeof io>;
let wsUser2: ReturnType<typeof io>;

const api = request('http://localhost:4000');

describe('E2E Conversation/Message Flow', () => {
  beforeEach(async () => {
    // Nettoyage de la table friendships avant chaque test
    const { createClient } = require('@supabase/supabase-js');
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    await supabase.from('friendships').delete().neq('user_id_1', '');
  });
  beforeEach(async () => {
    // Nettoyage de la table friendships avant chaque test
    const { createClient } = require('@supabase/supabase-js');
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    await supabase.from('friendships').delete().neq('user_id_1', '');
  });
  beforeAll((done) => {
    wsUser1 = io('http://127.0.0.1:4000', { auth: { token: TOKEN_USER1 } });
    wsUser2 = io('http://127.0.0.1:4000', { auth: { token: TOKEN_USER2 } });

    wsUser1.on('connect_error', (err) => {
      console.error('[TEST][User1] connect_error', err);
    });
    wsUser2.on('connect_error', (err) => {
      console.error('[TEST][User2] connect_error', err);
    });
    wsUser1.on('disconnect', (reason) => {
      console.error('[TEST][User1] disconnect', reason);
    });
    wsUser2.on('disconnect', (reason) => {
      console.error('[TEST][User2] disconnect', reason);
    });

    let user1Ready = false;
    let user2Ready = false;

    wsUser1.on('connect', () => {
      console.log('[TEST][User1] connected');
      wsUser1.emit('join', USER1_ID);
      console.log('[TEST][User1] join sent', USER1_ID);
      user1Ready = true;
      if (user2Ready) done();
    });
    wsUser2.on('connect', () => {
      console.log('[TEST][User2] connected');
      console.log('[TEST][User2] [JOIN] USER2_ID utilisé pour join:', USER2_ID);
    wsUser2.emit('join', USER2_ID);
      console.log('[TEST][User2] join sent', USER2_ID);
      user2Ready = true;
      if (user1Ready) done();
    });
  });

  afterAll(() => {
    wsUser1.disconnect();
    wsUser2.disconnect();
  });

  it('Ajout d\'ami', async () => {
    const res = await api
      .post(`/api/v1/friendships/request/${USER2_ID}`)
      .set('Authorization', `Bearer ${TOKEN_USER1}`);
    if (![200, 201].includes(res.status)) {
      console.log('Erreur ajout ami:', res.status, res.body);
    }
    expect([200, 201]).toContain(res.status);
  });

  it('Création ou récupération de conversation', async () => {
    const res = await api
      .post(`/api/v1/conversations/${USER2_ID}`)
      .set('Authorization', `Bearer ${TOKEN_USER1}`);
    expect(res.status).toBe(200);
    conversationId = res.body.id;
    expect(conversationId).toBeDefined();
  });

  it('Envoi d\'un message', async () => {
    const res = await api
      .post(`/api/v1/conversations/${conversationId}/messages`)
      .set('Authorization', `Bearer ${TOKEN_USER1}`)
      .send({ type: 'text', content: 'Hello world!' });
    expect(res.status).toBe(201);
    messageId = res.body.id;
    expect(messageId).toBeDefined();
  });

  it('Édition du message', async () => {
    const res = await api
      .patch(`/api/v1/conversations/messages/${messageId}`)
      .set('Authorization', `Bearer ${TOKEN_USER1}`)
      .send({ content: 'Message modifié' });
    expect(res.status).toBe(200);
    expect(res.body.content).toBe('Message modifié');
  });

  it('Suppression de la conversation', async () => {
    const res = await api
      .delete(`/api/v1/conversations/${conversationId}`)
      .set('Authorization', `Bearer ${TOKEN_USER1}`);
    expect(res.status).toBe(204);
  });

  it('Notifications WebSocket reçues', (done) => {
    jest.setTimeout(20000);
    let newMsg = false, editedMsg = false, deletedConv = false;
    let localConversationId = '';
    let localMessageId = '';

    wsUser2.on('message:new', (msg) => {
      console.log('[TEST][User2] [EVENT] message:new', msg);
      if (msg.id === localMessageId) newMsg = true;
    });
    wsUser2.on('message:edited', (msg) => {
      console.log('[TEST][User2] [EVENT] message:edited', msg);
      if (msg.id === localMessageId && msg.content === 'Message modifié') editedMsg = true;
    });
    wsUser2.on('conversation:deleted', (data) => {
      console.log('[TEST][User2] [EVENT] conversation:deleted', data);
      if (data.conversationId === localConversationId) deletedConv = true;
      if (newMsg && editedMsg && deletedConv) {
        console.log('[TEST][User2] [EVENT] Tous les events reçus, done() appelé');
        done();
      }
    });

    // Exécute toutes les actions API dans une IIFE asynchrone
    (async () => {
      try {
        // 1. Création de la conversation
        const resConv = await api
          .post(`/api/v1/conversations/${USER2_ID}`)
          .set('Authorization', `Bearer ${TOKEN_USER1}`);
        expect(resConv.status).toBe(200);
        localConversationId = resConv.body.id;
        expect(localConversationId).toBeDefined();
        console.log('[TEST][User2] [STEP] Conversation créée', localConversationId);

        // 2. Envoi du message
        const resMsg = await api
          .post(`/api/v1/conversations/${localConversationId}/messages`)
          .set('Authorization', `Bearer ${TOKEN_USER1}`)
          .send({ type: 'text', content: 'Hello world!' });
        expect(resMsg.status).toBe(201);
        localMessageId = resMsg.body.id;
        expect(localMessageId).toBeDefined();
        console.log('[TEST][User2] [STEP] Message envoyé', localMessageId);

        // 3. Edition du message
        const resEdit = await api
          .patch(`/api/v1/conversations/messages/${localMessageId}`)
          .set('Authorization', `Bearer ${TOKEN_USER1}`)
          .send({ content: 'Message modifié' });
        expect(resEdit.status).toBe(200);
        expect(resEdit.body.content).toBe('Message modifié');
        console.log('[TEST][User2] [STEP] Message édité', localMessageId);

        // 4. Suppression de la conversation
        const resDelete = await api
          .delete(`/api/v1/conversations/${localConversationId}`)
          .set('Authorization', `Bearer ${TOKEN_USER1}`);
        expect(resDelete.status).toBe(204);
        console.log('[TEST][User2] [STEP] Conversation supprimée', localConversationId);

        // Timeout de sécurité
        setTimeout(() => {
          if (!newMsg || !editedMsg || !deletedConv) {
            console.error('[TEST][User2] [TIMEOUT] Events non reçus :', { newMsg, editedMsg, deletedConv });
            done.fail('Tous les events WebSocket n’ont pas été reçus à temps');
          }
        }, 15000);
      } catch (err) {
        console.error('[TEST][User2] [ERROR] Erreur lors de l\'exécution des étapes', err);
        done.fail(err);
      }
    })();
  });
});
