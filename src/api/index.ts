import { Router } from 'express';
import v1Routes from './v1';
import videoRoutes from '../routes/video.routes';
import moderationRoutes from '../routes/moderation.routes';
import webhookRoutes from '../routes/webhook.routes';

const router = Router();

router.use('/v1', v1Routes);
router.use('/video', videoRoutes);
router.use('/moderation', moderationRoutes);
router.use('/webhook', webhookRoutes);

export default router;
