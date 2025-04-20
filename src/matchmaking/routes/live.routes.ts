import { Router } from 'express';
import {
  joinMatchmaking,
  nextMatchmaking,
  leaveMatchmaking,
  getCurrentMatchmakingSession
} from '../controllers/live.controller';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = Router();

router.post('/join', authenticateToken, joinMatchmaking);
router.post('/next', authenticateToken, nextMatchmaking);
router.post('/leave', authenticateToken, leaveMatchmaking);
router.get('/current', authenticateToken, getCurrentMatchmakingSession);

export default router;
