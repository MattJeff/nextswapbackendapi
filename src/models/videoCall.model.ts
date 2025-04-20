export type CallStatus = 'started' | 'ended' | 'missed';

export interface VideoCall {
  id: string;
  conversation_id: string;
  caller_id: string;
  callee_id: string;
  status: CallStatus;
  started_at: string;
  ended_at?: string;
  room_url: string;
}
