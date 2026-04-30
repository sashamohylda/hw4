import { Router } from 'express';
import {
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from '../controllers/announcements.controller.js';
import {
  createAnnouncementValidator,
  updateAnnouncementValidator,
} from '../validators/announcements.validator.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', getAnnouncements);
router.get('/:id', getAnnouncementById);
router.post('/', authenticate, createAnnouncementValidator, createAnnouncement);
router.patch('/:id', authenticate, updateAnnouncementValidator, updateAnnouncement);
router.delete('/:id', authenticate, deleteAnnouncement);

export default router;4
