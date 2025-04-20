import { Request, Response, NextFunction } from 'express';
import { logActivity } from './moderation.controller';

import { endRoom } from '../services/room.service';
import { sendNotification } from '../services/notification.service';

// Webhook VideoSDK.live (fin d'appel, recording, etc.)
export const videoSDKWebhook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { event, roomId, users, recordingId } = req.body;
    switch (event) {
      case 'meeting.ended':
        endRoom(roomId);
        if (Array.isArray(users)) {
          for (const userId of users) {
            await sendNotification(userId, { type: 'video_call_ended', roomId });
          }
        }
        await logActivity('system', 'videosdk_webhook:meeting.ended', { roomId, users });
        break;
      case 'recording.started':
        await logActivity('system', 'videosdk_webhook:recording.started', { roomId, recordingId });
        if (Array.isArray(users)) {
          for (const userId of users) {
            await sendNotification(userId, { type: 'recording_started', roomId, recordingId });
          }
        }
        break;
      case 'recording.stopped':
        await logActivity('system', 'videosdk_webhook:recording.stopped', { roomId, recordingId });
        if (Array.isArray(users)) {
          for (const userId of users) {
            await sendNotification(userId, { type: 'recording_stopped', roomId, recordingId });
          }
        }
        break;
      default:
        await logActivity('system', `videosdk_webhook:${event}`, req.body);
    }
    res.status(200).json({ received: true });
  } catch (error) {
    next(error);
  }
};
