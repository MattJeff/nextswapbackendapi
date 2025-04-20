import { Router } from 'express';
import usersRoutes from './users.routes';
import userFiltersRoutes from './userFilters.routes';
import profilesRoutes from './profiles.routes';
import authRoutes from './auth.routes';
import friendshipsRoutes from './friendships.routes';
import blocksRoutes from './blocks.routes';
import matchmakingRoutes from './matchmaking.routes';

const router = Router();

router.use('/users', usersRoutes);
router.use('/user-filters', userFiltersRoutes);
router.use('/profiles', profilesRoutes);
router.use('/auth', authRoutes);
router.use('/friendships', friendshipsRoutes);
router.use('/blocks', blocksRoutes);
router.use('/matchmaking', matchmakingRoutes);

export default router;
