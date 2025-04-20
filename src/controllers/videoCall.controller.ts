import { Request, Response, NextFunction } from 'express';
import { VideoCallService } from '../services/videoCall.service';

export class VideoCallController {
  static async startCall(req: Request, res: Response, next: NextFunction) {
    try {
      const { conversationId } = req.params;
      const caller_id = req.user!.id;
      const { callee_id } = req.body; // doit être passé dans le body
      const call = await VideoCallService.startCall(conversationId, caller_id, callee_id);
      res.status(201).json(call);
    } catch (err) {
      next(err);
    }
  }

  static async endCall(req: Request, res: Response, next: NextFunction) {
    try {
      const { callId } = req.params;
      await VideoCallService.endCall(callId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  static async getActiveCall(req: Request, res: Response, next: NextFunction) {
    try {
      const { conversationId } = req.params;
      const call = await VideoCallService.getActiveCall(conversationId);
      res.status(200).json(call);
    } catch (err) {
      next(err);
    }
  }
}
