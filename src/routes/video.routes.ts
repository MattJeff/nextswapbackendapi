import { Router } from 'express';
import { createVideoCall } from '../controllers/video.controller';

const router = Router();

router.post('/room', createVideoCall);

export default router;
