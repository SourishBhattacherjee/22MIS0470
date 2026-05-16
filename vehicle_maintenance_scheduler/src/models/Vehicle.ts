import mongoose, { Schema, Document } from 'mongoose';

export interface IMaintenance extends Document {
  serviceType: string;
  serviceDate: Date;
  nextDueDate: Date;
  status: 'pending' | 'completed';
}

export interface IVehicle extends Document {
  make: string;
  vehicleModel: string;
  year: number;
  licensePlate: string;
  maintenanceSchedules: mongoose.Types.DocumentArray<IMaintenance>;
}

const MaintenanceSchema: Schema = new Schema({
  serviceType: { type: String, required: true },
  serviceDate: { type: Date, required: true },
  nextDueDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' }
});

const VehicleSchema: Schema = new Schema({
  make: { type: String, required: true },
  vehicleModel: { type: String, required: true },
  year: { type: Number, required: true },
  licensePlate: { type: String, required: true, unique: true },
  maintenanceSchedules: [MaintenanceSchema]
}, { timestamps: true });

export default mongoose.model<IVehicle>('Vehicle', VehicleSchema);
