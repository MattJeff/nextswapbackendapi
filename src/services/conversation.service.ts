import { supabase } from '../config/supabase';
import { Conversation } from '../models/conversation.model';

export class ConversationService {
  static async getOrCreateConversation(userId1: string, userId2: string): Promise<Conversation> {
    // Always order for uniqueness
    const [u1, u2] = userId1 < userId2 ? [userId1, userId2] : [userId2, userId1];
    // Check if exists
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user1_id', u1)
      .eq('user2_id', u2)
      .single();
    if (data) return data;
    // Create if not exists
    const { data: created, error: createErr } = await supabase
      .from('conversations')
      .insert([{ user1_id: u1, user2_id: u2 }])
      .select()
      .single();
    if (createErr) throw new Error(createErr.message);
    return created;
  }

  static async listUserConversations(userId: string): Promise<Conversation[]> {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  }

  static async deleteConversation(conversationId: string, userId: string): Promise<void> {
    const { data: conv, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .single();
    if (error || !conv) throw new Error('Conversation not found');
    if (conv.user1_id !== userId && conv.user2_id !== userId) {
      throw new Error('Not authorized');
    }
    const { error: delErr } = await supabase
      .from('conversations')
      .delete()
      .eq('id', conversationId);
    if (delErr) throw new Error(delErr.message);
    // Notif temps réel aux deux participants
    const { emitToUser } = require('../socket');
    console.log('[SOCKET][conversation:deleted] to', conv.user1_id, conv.user2_id);
    emitToUser(conv.user1_id, 'conversation:deleted', { conversationId });
    emitToUser(conv.user2_id, 'conversation:deleted', { conversationId });
  }
}
