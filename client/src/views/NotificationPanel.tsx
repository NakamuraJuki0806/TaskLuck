import { Notification } from '../models';

type NotificationPanelProps = {
  open: boolean;
  notifications: Notification[];
  unreadCount: number;
  onClose: () => void;
  onRead: (id: number) => void;
  onClear: () => void;
};

export function NotificationPanel({ open, notifications, unreadCount, onClose, onRead, onClear }: NotificationPanelProps) {
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
              {!n.read ? <div className="notif-dot" /> : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
