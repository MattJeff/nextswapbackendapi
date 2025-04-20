import { Router } from 'express';
import {
  sendFriendRequest,
  acceptFriendRequest,
  removeFriend,
  listFriends,
  listPendingRequests
} from '../../controllers/friendship.controller';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = Router();

router.post('/request/:userId', authenticateToken, sendFriendRequest);
router.post('/accept/:userId', authenticateToken, acceptFriendRequest);
router.put('/accept/:userId', authenticateToken, acceptFriendRequest);
router.delete('/:userId', authenticateToken, removeFriend);
router.get('/', authenticateToken, listFriends);
router.get('/pending', authenticateToken, listPendingRequests);

export default router;
