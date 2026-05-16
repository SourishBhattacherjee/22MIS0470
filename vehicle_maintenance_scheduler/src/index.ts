import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { Log } from 'logging_middleware';
import vehicleRoutes from './routes/vehicleRoutes';

import scheduleRoutes from './routes/scheduleRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/vehicles', vehicleRoutes);
app.use('/schedule', scheduleRoutes);

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vehicle_maintenance';

mongoose.connect(MONGO_URI)
  .then(() => {
    Log('backend', 'info', 'db', 'Connected to MongoDB');
    app.listen(PORT, () => {
      Log('backend', 'info', 'service', `Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    Log('backend', 'error', 'db', `MongoDB connection error: ${error.message}`);
  });
