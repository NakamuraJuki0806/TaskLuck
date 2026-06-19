import express from 'express';

const router = express.Router();

// 承認システム用メモリストア
let approvals = [];

// GET /api/approval - 承認待ちのタスク一覧
router.get('/', (_req, res) => {
  res.json(approvals);
});

// POST /api/approval - 承認待ちに追加
router.post('/', (req, res) => {
  const { taskId, taskName, userId, xp } = req.body;
  
  if (!taskId || !taskName || !userId) {
    return res.status(400).json({ error: 'taskId、taskName、userIdは必須です' });
  }

  const approval = {
    id: Date.now(),
    taskId,
    taskName,
    userId,
    xp: xp || 0,
    status: 'pending', // pending, approved, rejected
    createdAt: new Date().toISOString(),
  };

  approvals.push(approval);
  res.status(201).json(approval);
});

// PUT /api/approval/:id - 承認または却下
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'statusは"approved"または"rejected"である必要があります' });
  }

  const approval = approvals.find(a => a.id === id);
  if (!approval) {
    return res.status(404).json({ error: '承認が見つかりません' });
  }

  approval.status = status;
  res.json(approval);
});

// GET /api/approval/count/pending - 承認待ち件数
router.get('/count/pending', (_req, res) => {
  const count = approvals.filter(a => a.status === 'pending').length;
  res.json({ count });
});

export default router;
