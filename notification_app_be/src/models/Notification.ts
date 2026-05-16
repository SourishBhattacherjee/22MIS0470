import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  userId: string;
  type: 'EMAIL' | 'SMS' | 'PUSH';
  payload: {
    subject?: string;
    body: string;
  };
  status: 'PENDING' | 'SENT' | 'FAILED';
  retryCount: number;
  errorMessage?: string;
}

const NotificationSchema: Schema = new Schema({
  userId: { type: String, required: true },
  type: { type: String, enum: ['EMAIL', 'SMS', 'PUSH'], required: true },
  payload: {
    subject: { type: String },
    body: { type: String, required: true }
  },
  status: { type: String, enum: ['PENDING', 'SENT', 'FAILED'], default: 'PENDING' },
  retryCount: { type: Number, default: 0 },
  errorMessage: { type: String }
}, { timestamps: true });

export default mongoose.model<INotification>('Notification', NotificationSchema);
