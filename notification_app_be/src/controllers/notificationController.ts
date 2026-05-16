import { Request, Response } from 'express';
import Notification, { INotification } from '../models/Notification';
import { Log } from 'logging_middleware';

export const createNotification = async (req: Request, res: Response) => {
  try {
    const notification: INotification = new Notification(req.body);
    await notification.save();
    await Log('backend', 'info', 'controller', `Notification created: ${notification._id}`);
    res.status(201).json(notification);
  } catch (error: any) {
    await Log('backend', 'error', 'controller', `Failed to create notification: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

export const getAllNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await Notification.find();
    res.status(200).json(notifications);
  } catch (error: any) {
    await Log('backend', 'error', 'controller', `Failed to fetch notifications: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const markAsSent = async (req: Request, res: Response) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { status: 'SENT', errorMessage: '' },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    await Log('backend', 'info', 'controller', `Notification marked as SENT: ${notification._id}`);
    res.status(200).json(notification);
  } catch (error: any) {
    await Log('backend', 'error', 'controller', `Failed to update notification: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

export const retryFailedNotifications = async (req: Request, res: Response) => {
  try {
    const failedNotifications = await Notification.find({ status: 'FAILED' });
    
    const retriedIds = [];
    for (const notif of failedNotifications) {
      if (notif.retryCount < 5) { // Arbitrary limit
        notif.status = 'PENDING';
        notif.retryCount += 1;
        notif.errorMessage = '';
        await notif.save();
        retriedIds.push(notif._id);
      }
    }

    await Log('backend', 'info', 'cron_job', `Retried ${retriedIds.length} failed notifications`);
    res.status(200).json({ message: `Retried ${retriedIds.length} notifications`, retriedIds });
  } catch (error: any) {
    await Log('backend', 'error', 'controller', `Failed to retry notifications: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

import { fetchNotifications } from '../services/apiService';
import { getTopNotifications } from '../services/priorityService';

export const getTopPriorityNotifications = async (req: Request, res: Response) => {
  try {
    const token = process.env.ACCESS_TOKEN;
    if (!token) {
      return res.status(401).json({ error: 'No access token configured' });
    }

    const evaluationNotifications = await fetchNotifications(token);
    
    // Notifications come as { notifications: [...] } from some APIs, or just an array
    const list = Array.isArray(evaluationNotifications) ? evaluationNotifications : evaluationNotifications.notifications || [];

    const topNotifications = getTopNotifications(list, 10);

    await Log('backend', 'info', 'controller', 'Fetched and ranked top 10 notifications');
    res.status(200).json({ topNotifications });
  } catch (error: any) {
    await Log('backend', 'error', 'controller', `Failed to fetch top notifications: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};
