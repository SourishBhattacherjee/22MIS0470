import { Router } from 'express';
import { getSchedule } from '../controllers/scheduleController';

const router = Router();

router.get('/', getSchedule);

export default router;
