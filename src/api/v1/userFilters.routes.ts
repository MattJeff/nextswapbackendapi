import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { getUserFiltersController, updateUserFiltersController } from '../../controllers/userFilters.controller';

const router = Router();

router.get('/', authenticate, getUserFiltersController);
router.patch('/', authenticate, updateUserFiltersController);

export default router;
