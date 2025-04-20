import { Router } from 'express';
import { getMyProfile, updateMyProfile, getProfileById, uploadProfilePhoto } from '../../controllers/profile.controller';
import { validateUpdateProfile, validatePhotoUpload } from '../../middleware/validateProfile';
import multer from 'multer';

const router = Router();
const upload = multer();

router.get('/me', getMyProfile);
router.patch('/me', validateUpdateProfile, updateMyProfile);
router.get('/:userId', getProfileById);
router.post('/me/photo', upload.single('photo'), validatePhotoUpload, uploadProfilePhoto);

export default router;
