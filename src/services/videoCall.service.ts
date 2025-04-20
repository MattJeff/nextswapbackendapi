import { supabase } from '../config/supabase';
import { VideoCall, CallStatus } from '../models/videoCall.model';
import { v4 as uuidv4 } from 'uuid';

export class VideoCallService {
  static async startCall(conversation_id: string, caller_id: string, callee_id: string): Promise<VideoCall> {
    const room_url = `https://videosdk.fake/room/${uuidv4()}`; // Remplace par ton vrai provider si besoin
    const started_at = new Date().toISOString();
    const { data, error } = await supabase
      .from('video_calls')
      .insert([{ conversation_id, caller_id, callee_id, status: 'started', started_at, room_url }])
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  static async endCall(call_id: string): Promise<void> {
    const ended_at = new Date().toISOString();
    const { error } = await supabase
      .from('video_calls')
      .update({ status: 'ended', ended_at })
      .eq('id', call_id);
    if (error) throw new Error(error.message);
  }

  static async getActiveCall(conversation_id: string): Promise<VideoCall | null> {
    const { data, error } = await supabase
      .from('video_calls')
      .select('*')
      .eq('conversation_id', conversation_id)
      .eq('status', 'started')
      .order('started_at', { ascending: false })
      .limit(1)
      .single();
    if (error && error.code !== 'PGRST116') throw new Error(error.message); // ignore no rows
    return data || null;
  }
}
