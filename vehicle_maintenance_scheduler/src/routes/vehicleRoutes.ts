import { Router } from 'express';
import {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  addMaintenanceSchedule,
  getMaintenanceSchedules,
  markMaintenanceCompleted
} from '../controllers/vehicleController';

const router = Router();

router.post('/', createVehicle);
router.get('/', getAllVehicles);
router.get('/:id', getVehicleById);
router.put('/:id', updateVehicle);
router.delete('/:id', deleteVehicle);

router.post('/:id/maintenance', addMaintenanceSchedule);
router.get('/:id/maintenance', getMaintenanceSchedules);
router.patch('/:id/maintenance/:scheduleId/complete', markMaintenanceCompleted);

export default router;
