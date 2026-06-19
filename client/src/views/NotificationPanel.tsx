import React from 'react';
import { Notification } from '../controllers/useNotifications';

interface NotificationPanelProps {
  notifications: Notification[];
  unreadCount: number;
  onRead: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function NotificationPanel({
  notifications,
  unreadCount,
  onRead,
  onDelete,
}: NotificationPanelProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-lg max-w-sm">
      {/* ヘッダー */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-gray-900">通知</h3>
          {unreadCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold">
              {Math.min(unreadCount, 9)}
            </span>
          )}
        </div>
      </div>

      {/* 通知リスト */}
      <div className="max-h-96 overflow-y-auto divide-y divide-gray-200">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-gray-500 text-sm">
            通知がありません
          </div>
        ) : (
          notifications.map(notification => (
            <div
              key={notification.id}
              className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                !notification.read ? 'bg-blue-50' : ''
              }`}
              onClick={() => {
                if (!notification.read) onRead(notification.id);
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  {!notification.read && (
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                      <h4 className="font-semibold text-gray-900 text-sm">{notification.title}</h4>
                    </div>
                  )}
                  {notification.read && (
                    <h4 className="font-medium text-gray-700 text-sm mb-1">{notification.title}</h4>
                  )}
                  <p className="text-xs text-gray-600 line-clamp-2">{notification.sub}</p>
                  <div className="text-xs text-gray-500 mt-2">
                    {new Date(notification.createdAt).toLocaleTimeString('ja-JP', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    onDelete(notification.id);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* フッター */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-gray-200 text-center">
          <a href="#" className="text-xs font-medium text-purple-600 hover:text-purple-700">
            すべての通知を表示
          </a>
        </div>
      )}
    </div>
  );
}
