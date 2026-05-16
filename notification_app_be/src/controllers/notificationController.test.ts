import express from 'express';
import request from 'supertest';
import notificationRoutes from '../routes/notificationRoutes';
import Notification from '../models/Notification';

jest.mock('logging_middleware', () => ({
  Log: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use('/api/notifications', notificationRoutes);

describe('Notification Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/notifications', () => {
    it('should return all notifications', async () => {
      const mockNotifs = [{ _id: '1', recipient: 'user1', message: 'Hello', status: 'PENDING' }];
      jest.spyOn(Notification, 'find').mockResolvedValue(mockNotifs as any);

      const response = await request(app).get('/api/notifications');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockNotifs);
    });
  });

  describe('POST /api/notifications', () => {
    it('should create a new notification', async () => {
      const notifData = { recipient: 'user2', message: 'Test message', type: 'EMAIL' };
      const savedNotif = { _id: '2', ...notifData, status: 'PENDING' };
      
      jest.spyOn(Notification.prototype, 'save').mockResolvedValue(savedNotif as any);

      const response = await request(app)
        .post('/api/notifications')
        .send(notifData);

      expect(response.status).toBe(201);
      expect(Notification.prototype.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('PATCH /api/notifications/:id/sent', () => {
    it('should mark notification as sent', async () => {
      const mockNotif = { _id: '1', status: 'SENT', errorMessage: '' };
      jest.spyOn(Notification, 'findByIdAndUpdate').mockResolvedValue(mockNotif as any);

      const response = await request(app).patch('/api/notifications/1/sent');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('SENT');
    });

    it('should return 404 if notification not found', async () => {
      jest.spyOn(Notification, 'findByIdAndUpdate').mockResolvedValue(null as any);

      const response = await request(app).patch('/api/notifications/999/sent');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Notification not found');
    });
  });

  describe('POST /api/notifications/retry', () => {
    it('should retry failed notifications', async () => {
      const failedNotifs = [
        { 
          _id: '1', 
          status: 'FAILED', 
          retryCount: 1, 
          save: jest.fn().mockResolvedValue(true)
        }
      ];
      
      jest.spyOn(Notification, 'find').mockResolvedValue(failedNotifs as any);

      const response = await request(app).post('/api/notifications/retry');

      expect(response.status).toBe(200);
      expect(response.body.retriedIds).toContain('1');
      expect(failedNotifs[0].status).toBe('PENDING');
      expect(failedNotifs[0].save).toHaveBeenCalledTimes(1);
    });
  });
});
