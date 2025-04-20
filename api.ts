// API client TypeScript pour le backend video-matchmaking
// Toutes les fonctions CRUD pour chaque ressource
// Utilise fetch natif, typé, baseURL configurable

const BASE_URL = 'http://127.0.0.1:4000/api/v1';

// -------- Types --------

export type User = {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  created_at: string;
  updated_at?: string;
};

export type Friendship = {
  user_id_1: string;
  user_id_2: string;
  status: 'pending' | 'accepted' | 'blocked';
  created_at: string;
};

export type Conversation = {
  id: string;
  user_id_1: string;
  user_id_2: string;
  created_at: string;
  updated_at?: string;
};

export type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  type: 'text' | 'image' | 'video';
  content: string;
  url?: string;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
};

// -------- Helpers --------

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

// -------- USERS --------

export const UserAPI = {
  get: (id: string) => fetchApi<User>(`/users/${id}`),
  list: () => fetchApi<User[]>(`/users`),
  create: (data: Partial<User>) => fetchApi<User>(`/users`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: Partial<User>) => fetchApi<User>(`/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => fetchApi<void>(`/users/${id}`, { method: 'DELETE' }),
};

// -------- FRIENDSHIPS --------

export const FriendshipAPI = {
  request: (userId: string) => fetchApi<Friendship>(`/friendships/request/${userId}`, { method: 'POST' }),
  accept: (userId: string) => fetchApi<Friendship>(`/friendships/accept/${userId}`, { method: 'POST' }),
  block: (userId: string) => fetchApi<Friendship>(`/friendships/block/${userId}`, { method: 'POST' }),
  list: () => fetchApi<Friendship[]>(`/friendships`),
  get: (userId: string) => fetchApi<Friendship>(`/friendships/${userId}`),
  delete: (userId: string) => fetchApi<void>(`/friendships/${userId}`, { method: 'DELETE' }),
};

// -------- CONVERSATIONS --------

export const ConversationAPI = {
  createOrGet: (userId: string) => fetchApi<Conversation>(`/conversations/${userId}`, { method: 'POST' }),
  get: (id: string) => fetchApi<Conversation>(`/conversations/${id}`),
  list: () => fetchApi<Conversation[]>(`/conversations`),
  delete: (id: string) => fetchApi<void>(`/conversations/${id}`, { method: 'DELETE' }),
};

// -------- MESSAGES --------

export const MessageAPI = {
  list: (conversationId: string) => fetchApi<Message[]>(`/conversations/${conversationId}/messages`),
  send: (conversationId: string, data: Partial<Message>) => fetchApi<Message>(`/conversations/${conversationId}/messages`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  edit: (messageId: string, data: Partial<Message>) => fetchApi<Message>(`/conversations/messages/${messageId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  delete: (messageId: string) => fetchApi<void>(`/conversations/messages/${messageId}`, { method: 'DELETE' }),
};

// -------- VIDEO LIVE MATCHMAKING --------

export const VideoLiveMatchmakingAPI = {
  join: () => fetchApi<any>(`/video-live-matchmaking/join`, { method: 'POST' }),
  next: () => fetchApi<any>(`/video-live-matchmaking/next`, { method: 'POST' }),
  leave: () => fetchApi<any>(`/video-live-matchmaking/leave`, { method: 'POST' }),
  getCurrent: () => fetchApi<any>(`/video-live-matchmaking/current`),
};

// -------- Exemple d'utilisation --------
// import { UserAPI, FriendshipAPI, ConversationAPI, MessageAPI, VideoLiveMatchmakingAPI } from './api';
// await UserAPI.list();
// await FriendshipAPI.request('user-id');
// await ConversationAPI.createOrGet('user-id');
// await MessageAPI.send('conv-id', { content: 'Hello', type: 'text', sender_id: '...' });
// await VideoLiveMatchmakingAPI.join();
