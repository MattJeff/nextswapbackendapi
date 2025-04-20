import { Router } from 'express';
import { ConversationController } from '../controllers/conversation.controller';
import { MessageController } from '../controllers/message.controller';
import { VideoCallController } from '../controllers/videoCall.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Conversation
router.post('/:friendId', authenticateToken, ConversationController.getOrCreateConversation);
router.get('/', authenticateToken, ConversationController.listUserConversations);

// Messages
router.get('/:conversationId/messages', authenticateToken, MessageController.getConversationMessages);
router.post('/:conversationId/messages', authenticateToken, MessageController.sendMessage);

router.delete('/messages/:messageId', authenticateToken, MessageController.deleteMessage);
router.patch('/messages/:messageId', authenticateToken, MessageController.editMessage);

// Video calls
router.delete('/:conversationId', authenticateToken, ConversationController.deleteConversation);
router.post('/:conversationId/video-call/start', authenticateToken, VideoCallController.startCall);
router.post('/video-call/:callId/end', authenticateToken, VideoCallController.endCall);
router.get('/:conversationId/video-call/active', authenticateToken, VideoCallController.getActiveCall);

export default router;
