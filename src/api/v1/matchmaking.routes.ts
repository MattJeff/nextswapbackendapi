import { Router } from 'express';
import { requestMatch } from '../../controllers/matchmaking.controller';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = Router();

router.post('/', authenticateToken, requestMatch);

export default router;
