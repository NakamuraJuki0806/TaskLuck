import { useState, useCallback } from 'react';

export interface Notification {
  id: number;
  title: string;
  sub: string;
  uid: number;
  read: boolean;
  createdAt: string;
}

const API_BASE = 'http://localhost:5000/api';

export function useNotifications(userId: number) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // 通知を取得
  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/notifications/user/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch notifications');
      const data: Notification[] = await response.json();
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, [userId]);

  // 通知を作成
  const createNotification = useCallback(
    async (title: string, sub: string, uid?: number) => {
      try {
        const response = await fetch(`${API_BASE}/notifications`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            sub,
            uid: uid || userId,
          }),
        });

        if (!response.ok) throw new Error('Failed to create notification');
        const newNotif: Notification = await response.json();
        setNotifications(prev => [newNotif, ...prev]);
        if (!newNotif.read) setUnreadCount(prev => prev + 1);
      } catch (error) {
        console.error('Error creating notification:', error);
      }
    },
    [userId]
  );

  // 通知を既読にマーク
  const markAsRead = useCallback(async (id: number) => {
    try {
      const response = await fetch(`${API_BASE}/notifications/${id}/read`, {
        method: 'PUT',
      });

      if (!response.ok) throw new Error('Failed to mark as read');
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  // 通知を削除
  const deleteNotification = useCallback(async (id: number) => {
    try {
      const response = await fetch(`${API_BASE}/notifications/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete notification');
      const deleted = notifications.find(n => n.id === id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      if (deleted && !deleted.read) setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }, [notifications]);

  return {
    notifications,
    unreadCount,
    fetchNotifications,
    createNotification,
    markAsRead,
    deleteNotification,
  };
}
