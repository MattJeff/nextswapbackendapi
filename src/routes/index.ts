import { Router } from 'express';
import conversationRoutes from './conversation.routes';
import videoMatchmakingRoutes from './videoMatchmaking.routes';
// ... autres routes

const router = Router();

router.use('/conversations', conversationRoutes);
router.use('/video-matchmaking', videoMatchmakingRoutes);
// ... autres routes

export default router;
