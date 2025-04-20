import { Router } from 'express';
import { blockUser, unblockUser, listBlockedUsers } from '../../controllers/block.controller';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = Router();

router.post('/:userId', authenticateToken, blockUser);
router.delete('/:userId', authenticateToken, unblockUser);
router.get('/', authenticateToken, listBlockedUsers);

export default router;
