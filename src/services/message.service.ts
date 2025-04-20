import { supabase } from '../config/supabase';
import { Message, MessageType } from '../models/message.model';
import { emitToUser } from '../socket';

export class MessageService {
  static async sendMessage(params: {
    conversation_id: string;
    sender_id: string;
    type: MessageType;
    content?: string;
    url?: string;
  }): Promise<Message> {
    const { conversation_id, sender_id, type, content, url } = params;
    const { data, error } = await supabase
      .from('messages')
      .insert([{ conversation_id, sender_id, type, content, url }])
      .select()
      .single();
    if (error) throw new Error(error.message);
    // Notif temps réel pour tous les participants de la conversation
    const conv = await supabase.from('conversations').select('*').eq('id', conversation_id).single();
    if (conv.data) {
      emitToUser(conv.data.user1_id, 'message:new', data);
      emitToUser(conv.data.user2_id, 'message:new', data);
    }
    return data;
  }

  static async getConversationMessages(conversation_id: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversation_id)
      .is('deleted_at', null)
      .order('created_at', { ascending: true });
    if (error) throw new Error(error.message);
    return data || [];
  }

  static async deleteMessage(message_id: string, user_id: string): Promise<void> {
    // Soft delete: set deleted_at
    const { data, error } = await supabase
      .from('messages')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', message_id)
      .eq('sender_id', user_id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    if (data) {
      // Notif temps réel pour tous les participants de la conversation
      const msg = data;
      const conv = await supabase.from('conversations').select('*').eq('id', msg.conversation_id).single();
      if (conv.data) {
        emitToUser(conv.data.user1_id, 'message:deleted', msg);
        emitToUser(conv.data.user2_id, 'message:deleted', msg);
      }
    }
  }

  static async editMessage(message_id: string, user_id: string, content: string): Promise<Message> {
    // Log entrée
    console.log('[DEBUG] editMessage called', { message_id, user_id, content });

    const { data: msg, error: fetchErr } = await supabase
      .from('messages')
      .select('*')
      .eq('id', message_id)
      .single();
    if (fetchErr || !msg) {
      console.error('[DEBUG] Message not found', fetchErr, msg);
      throw new Error('Message not found');
    }
    if (msg.sender_id !== user_id) {
      console.error('[DEBUG] Not authorized', { sender_id: msg.sender_id, user_id });
      throw new Error('Not authorized');
    }
    const { data, error } = await supabase
      .from('messages')
      .update({ content, updated_at: new Date().toISOString() })
      .eq('id', message_id)
      .select()
      .single();
    if (error) {
      console.error('[DEBUG] Update error', error);
      throw new Error(error.message);
    }
    const conv = await supabase.from('conversations').select('*').eq('id', msg.conversation_id).single();
    if (conv.error || !conv.data) {
      console.error('[DEBUG] Conversation fetch error', conv.error, conv.data);
    } else {
      emitToUser(conv.data.user1_id, 'message:edited', data);
      emitToUser(conv.data.user2_id, 'message:edited', data);
    }
    return data;
  }
}
