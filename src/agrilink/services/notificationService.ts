import { NotificationItem } from '../types';
import { localStorageService } from './storageService';

export const notificationService = {
  getAll(): NotificationItem[] {
    return localStorageService.getNotifications();
  },

  getUnreadCount(): number {
    return this.getAll().filter(n => !n.read).length;
  },

  markAllAsRead() {
    const list = this.getAll().map(n => ({ ...n, read: true }));
    localStorageService.saveNotifications(list);
  },

  markAsRead(id: string) {
    const list = this.getAll().map(n => (n.id === id ? { ...n, read: true } : n));
    localStorageService.saveNotifications(list);
  },

  notify(data: {
    title: string;
    message: string;
    type: 'offer' | 'price' | 'verification' | 'logistics' | 'payment' | 'grievance';
    link?: string;
  }) {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: data.title,
      message: data.message,
      type: data.type,
      timestamp: 'Just now',
      read: false,
      link: data.link
    };
    const current = this.getAll();
    localStorageService.saveNotifications([newNotif, ...current]);
  }
};
