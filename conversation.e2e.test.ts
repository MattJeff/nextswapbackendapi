import request from 'supertest';
import { io as ClientIO, Socket } from 'socket.io-client';
import app from './src/app';

// Remplace par tes vrais tokens ou automatiser la création de users
const TOKEN_USER1 = process.env.TEST_TOKEN_USER1 || '<TOKEN_USER1>';
const TOKEN_USER2 = process.env.TEST_TOKEN_USER2 || '<TOKEN_USER2>';

let conversationId: string;
let messageId: string;
let wsUser1: Socket;
let wsUser2: Socket;

const api = request(app);

describe('E2E Conversation/Message Flow', () => {
  beforeAll((done) => {
    // Connexion WebSocket pour User1 et User2
    wsUser1 = ClientIO('http://localhost:3000', { auth: { token: TOKEN_USER1 } });
    wsUser2 = ClientIO('http://localhost:3000', { auth: { token: TOKEN_USER2 } });
    wsUser1.on('connect', () => {
      wsUser2.on('connect', () => {
        done();
      });
    });
  });

  afterAll(() => {
    wsUser1.disconnect();
    wsUser2.disconnect();
  });

  it('Ajout d\'ami', async () => {
    const res = await api
      .post('/api/v1/friends')
      .set('Authorization', `Bearer ${TOKEN_USER1}`)
      .send({ friendId: '<USER2_ID>' });
    expect(res.status).toBe(201);
  });

  it('Création ou récupération de conversation', async () => {
    const res = await api
      .post('/api/v1/conversations/<USER2_ID>')
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
    let newMsg = false, editedMsg = false, deletedConv = false;
    wsUser2.on('message:new', (msg) => {
      if (msg.id === messageId) newMsg = true;
    });
    wsUser2.on('message:edited', (msg) => {
      if (msg.id === messageId && msg.content === 'Message modifié') editedMsg = true;
    });
    wsUser2.on('conversation:deleted', (data) => {
      if (data.conversationId === conversationId) deletedConv = true;
      if (newMsg && editedMsg && deletedConv) done();
    });
    // Relance les actions si besoin pour déclencher les events
    wsUser2.emit('test:triggerEvents');
  });
});
