import { Router } from 'express';
import { reportUser } from '../controllers/moderation.controller';

const router = Router();

router.post('/report', reportUser);

export default router;
