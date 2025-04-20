import { Request, Response, NextFunction } from 'express';
import { ConversationService } from '../services/conversation.service';

export class ConversationController {
  static async getOrCreateConversation(req: Request, res: Response, next: NextFunction) {
    try {
      const friendId = req.params.friendId;
      const userId = req.user!.id;
      const conversation = await ConversationService.getOrCreateConversation(userId, friendId);
      res.status(200).json(conversation);
    } catch (err) {
      next(err);
    }
  }

  static async listUserConversations(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const conversations = await ConversationService.listUserConversations(userId);
      res.status(200).json(conversations);
    } catch (err) {
      next(err);
    }
  }

  static async deleteConversation(req: Request, res: Response, next: NextFunction) {
    try {
      const { conversationId } = req.params;
      const userId = req.user!.id;
      await ConversationService.deleteConversation(conversationId, userId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}


