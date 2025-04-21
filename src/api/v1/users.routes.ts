import { Router } from 'express';
import { 
  searchUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from '../../controllers/user.controller';
import { validateUserSearch } from '../../middleware/validateUserSearch';
import { authenticate } from '../../middleware/authenticate';

const router = Router();

router.get('/search', validateUserSearch, searchUsers);
router.get('/:id', authenticate, getUserById);
router.post('/', authenticate, createUser);
router.put('/:id', authenticate, updateUser);
router.patch('/:id', authenticate, updateUser);
router.delete('/:id', authenticate, deleteUser);

export default router;
