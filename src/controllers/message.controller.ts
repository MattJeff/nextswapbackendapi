import { Request, Response, NextFunction } from 'express';
import { MessageService } from '../services/message.service';

export class MessageController {
  static async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { type, content, url } = req.body;
      const { conversationId } = req.params;
      const sender_id = req.user!.id;
      const message = await MessageService.sendMessage({
        conversation_id: conversationId,
        sender_id,
        type,
        content,
        url
      });
      res.status(201).json(message);
    } catch (err) {
      next(err);
    }
  }

  static async getConversationMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const { conversationId } = req.params;
      const messages = await MessageService.getConversationMessages(conversationId);
      res.status(200).json(messages);
    } catch (err) {
      next(err);
    }
  }

  static async deleteMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { messageId } = req.params;
      const user_id = req.user!.id;
      await MessageService.deleteMessage(messageId, user_id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  static async editMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { messageId } = req.params;
      const { content } = req.body;
      const user_id = req.user!.id;
      const message = await MessageService.editMessage(messageId, user_id, content);
      res.status(200).json(message);
    } catch (err) {
      next(err);
    }
  }
}

