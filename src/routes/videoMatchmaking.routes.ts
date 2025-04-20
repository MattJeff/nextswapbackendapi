import { Router } from 'express';
import { getNextVideoProfile } from '../controllers/videoMatchmaking.controller';
import { authenticate } from '../middleware/authenticate';

const router = Router();

// GET /api/v1/video-matchmaking/next
router.get('/next', authenticate, getNextVideoProfile);

export default router;
