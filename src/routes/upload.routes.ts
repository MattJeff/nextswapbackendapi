import { Router } from 'express';
import multer from 'multer';
import { supabase } from '../config/supabase';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();
const upload = multer();

// Upload image or video for a message
router.post('/message-media', authenticateToken, upload.single('file'), async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });
    const ext = file.originalname.split('.').pop();
    const filename = `messages/${Date.now()}_${Math.floor(Math.random()*1e6)}.${ext}`;
    const { data, error } = await supabase.storage.from('media').upload(filename, file.buffer, {
      contentType: file.mimetype
    });
    if (error) return res.status(500).json({ error: error.message });
    const { data: publicUrl } = supabase.storage.from('media').getPublicUrl(filename);
    res.status(201).json({ url: publicUrl.publicUrl });
  } catch (err) {
    next(err);
  }
});

export default router;
