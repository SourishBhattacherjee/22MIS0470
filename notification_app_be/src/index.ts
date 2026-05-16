import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { Log } from 'logging_middleware';
import notificationRoutes from './routes/notificationRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/notifications', notificationRoutes);

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/notification_system';

mongoose.connect(MONGO_URI)
  .then(() => {
    Log('backend', 'info', 'db', 'Connected to MongoDB (Notifications)');
    app.listen(PORT, () => {
      Log('backend', 'info', 'service', `Notification service running on port ${PORT}`);
    });
  })
  .catch((error) => {
    Log('backend', 'error', 'db', `MongoDB connection error: ${error.message}`);
  });
