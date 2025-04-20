export type MessageType = 'text' | 'image' | 'video';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  type: MessageType;
  content?: string; // texte
  url?: string;     // image/vidéo
  created_at: string;
  deleted_at?: string;
}
