const { io } = require('socket.io-client');

const token = process.env.TEST_TOKEN_USER1 || '<TOKEN_USER1>';
const socket = io('http://localhost:3000', {
  auth: { token }
});

socket.on('connect', () => {
  console.log('Socket connecté !');
});

socket.on('message:new', (msg) => {
  console.log('Nouveau message reçu :', msg);
});

socket.on('message:edited', (msg) => {
  console.log('Message édité :', msg);
});

socket.on('conversation:deleted', (data) => {
  console.log('Conversation supprimée :', data);
});

// Pour tester manuellement :
socket.on('disconnect', () => {
  console.log('Déconnecté du serveur');
});
