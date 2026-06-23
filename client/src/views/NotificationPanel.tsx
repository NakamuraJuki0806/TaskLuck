import React from 'react';
import { Notification } from '../models';

type NotificationPanelProps = {
  open: boolean;
  notifications: Notification[];
  unreadCount: number;
  onClose: () => void;
  onRead: (id: number) => void;
  onClear: () => void;
  isMgr: boolean;
  onApprove: (taskId: number) => void;
  onReject: (taskId: number) => void;
};

export function NotificationPanel({ open, notifications, unreadCount, onClose, onRead, onClear, isMgr, onApprove, onReject }: NotificationPanelProps) {
  const handleApproveClick = (e: React.MouseEvent, taskId?: number) => { e.stopPropagation(); if (taskId) onApprove(taskId); };
  const handleRejectClick = (e: React.MouseEvent, taskId?: number) => { e.stopPropagation(); if (taskId) onReject(taskId); };

  return (
    <div className={`notif-panel ${open ? 'open' : ''}`} id="notif-panel">
      <div className="notif-hdr">
        <div className="notif-title">通知</div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{ fontSize: '13px', color: '#999' }}>{unreadCount} 未読</div>
          <button className="notif-clear" type="button" onClick={onClear}>すべて既読</button>
          <button className="btn btn-sm" type="button" onClick={onClose}>閉じる</button>
        </div>
      </div>
      <div className="notif-list">
        {notifications.length === 0 ? (
          <div className="notif-empty">通知はありません</div>
        ) : notifications.map((n) => (
          <div key={n.id} className={`notif-item ${n.read ? '' : 'unread'}`} onClick={() => onRead(n.id)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ minWidth: 0 }}>
                <div className="notif-title">{n.title}</div>
                <div className="notif-sub">{n.sub}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isMgr && n.taskId ? (
                  <>
                    <button className="btn btn-sm" type="button" onClick={(e) => handleApproveClick(e, n.taskId)} style={{ color: '#15803d', borderColor: '#bbf7d0' }}>承認</button>
                    <button className="btn btn-sm btn-danger" type="button" onClick={(e) => handleRejectClick(e, n.taskId)}>却下</button>
                  </>
                ) : null}
                {!n.read ? <div className="notif-dot" /> : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
