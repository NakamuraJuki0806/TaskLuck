import express from 'express';

const router = express.Router();

// 通知メモリストア
let notifications = [];

// GET /api/notifications - 通知一覧
router.get('/', (_req, res) => {
  res.json(notifications);
});

// GET /api/notifications/user/:uid - ユーザー別通知
router.get('/user/:uid', (req, res) => {
  const uid = parseInt(req.params.uid);
  const userNotifications = notifications.filter(n => n.uid === uid || n.uid === 0); // 0は全員対象
  res.json(userNotifications);
});

// POST /api/notifications - 通知作成
router.post('/', (req, res) => {
  const { title, sub, uid } = req.body;

  if (!title || !sub) {
    return res.status(400).json({ error: 'titleとsubは必須です' });
  }

  const notification = {
    id: Date.now(),
    title,
    sub,
    uid: uid || 0, // 0は全員対象
    read: false,
    createdAt: new Date().toISOString(),
  };

  notifications.push(notification);
  res.status(201).json(notification);
});

// PUT /api/notifications/:id/read - 既読にマーク
router.put('/:id/read', (req, res) => {
  const id = parseInt(req.params.id);
  const notification = notifications.find(n => n.id === id);

  if (!notification) {
    return res.status(404).json({ error: '通知が見つかりません' });
  }

  notification.read = true;
  res.json(notification);
});

// DELETE /api/notifications/:id - 通知削除
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = notifications.findIndex(n => n.id === id);

  if (index === -1) {
    return res.status(404).json({ error: '通知が見つかりません' });
  }

  const deleted = notifications.splice(index, 1);
  res.json(deleted[0]);
});

export default router;
