import { Router } from 'express';
import {
  createNotification,
  getAllNotifications,
  markAsSent,
  retryFailedNotifications,
  getTopPriorityNotifications
} from '../controllers/notificationController';

const router = Router();

router.post('/', createNotification);
router.get('/', getAllNotifications);
router.get('/top', getTopPriorityNotifications);
router.patch('/:id/sent', markAsSent);
router.post('/retry', retryFailedNotifications);

export default router;
