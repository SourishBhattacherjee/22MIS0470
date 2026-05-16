import { Request, Response } from 'express';
import Vehicle, { IVehicle } from '../models/Vehicle';
import { Log } from 'logging_middleware';

export const createVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle: IVehicle = new Vehicle(req.body);
    await vehicle.save();
    await Log('backend', 'info', 'controller', `Vehicle created successfully: ${vehicle._id}`);
    res.status(201).json(vehicle);
  } catch (error: any) {
    await Log('backend', 'error', 'controller', `Failed to create vehicle: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

export const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json(vehicles);
  } catch (error: any) {
    await Log('backend', 'error', 'controller', `Failed to fetch vehicles: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const getVehicleById = async (req: Request, res: Response) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      await Log('backend', 'warn', 'controller', `Vehicle not found: ${req.params.id}`);
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.status(200).json(vehicle);
  } catch (error: any) {
    await Log('backend', 'error', 'controller', `Failed to fetch vehicle: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    await Log('backend', 'info', 'controller', `Vehicle updated: ${vehicle._id}`);
    res.status(200).json(vehicle);
  } catch (error: any) {
    await Log('backend', 'error', 'controller', `Failed to update vehicle: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    await Log('backend', 'info', 'controller', `Vehicle deleted: ${req.params.id}`);
    res.status(200).json({ message: 'Vehicle deleted successfully' });
  } catch (error: any) {
    await Log('backend', 'error', 'controller', `Failed to delete vehicle: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const addMaintenanceSchedule = async (req: Request, res: Response) => {
  try {
    const { serviceType, serviceDate, nextDueDate } = req.body;
    
    // Validate dates
    if (new Date(serviceDate) > new Date(nextDueDate)) {
      return res.status(400).json({ error: 'Next due date must be after service date' });
    }

    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    vehicle.maintenanceSchedules.push({
      serviceType,
      serviceDate: new Date(serviceDate),
      nextDueDate: new Date(nextDueDate),
      status: 'pending'
    });

    await vehicle.save();
    await Log('backend', 'info', 'controller', `Maintenance schedule added for vehicle: ${vehicle._id}`);
    res.status(201).json(vehicle);
  } catch (error: any) {
    await Log('backend', 'error', 'controller', `Failed to add maintenance schedule: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

export const getMaintenanceSchedules = async (req: Request, res: Response) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    // Check overdue
    const currentDate = new Date();
    const schedules = vehicle.maintenanceSchedules.map(schedule => {
      const isOverdue = schedule.status === 'pending' && new Date(schedule.nextDueDate) < currentDate;
      return { ...schedule.toObject(), isOverdue };
    });

    res.status(200).json(schedules);
  } catch (error: any) {
    await Log('backend', 'error', 'controller', `Failed to fetch schedules: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const markMaintenanceCompleted = async (req: Request, res: Response) => {
  try {
    const { scheduleId } = req.params;
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    const schedule = vehicle.maintenanceSchedules.id(scheduleId);
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    schedule.status = 'completed';
    await vehicle.save();
    
    await Log('backend', 'info', 'controller', `Maintenance marked completed: ${scheduleId}`);
    res.status(200).json(vehicle);
  } catch (error: any) {
    await Log('backend', 'error', 'controller', `Failed to mark maintenance completed: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};
