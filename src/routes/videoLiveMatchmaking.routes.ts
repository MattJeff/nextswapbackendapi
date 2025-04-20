import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import {
  joinMatchmaking,
  nextMatchmaking,
  leaveMatchmaking,
  getCurrentMatchmakingSession
} from '../controllers/videoLiveMatchmaking.controller';

const router = Router();

router.post('/join', authenticate, joinMatchmaking);
router.post('/next', authenticate, nextMatchmaking);
router.post('/leave', authenticate, leaveMatchmaking);
router.get('/current', authenticate, getCurrentMatchmakingSession);

export default router;
