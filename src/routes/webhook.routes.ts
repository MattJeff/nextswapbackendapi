import { Router } from 'express';
import { videoSDKWebhook } from '../controllers/webhook.controller';

const router = Router();

router.post('/videosdk', videoSDKWebhook);

export default router;
