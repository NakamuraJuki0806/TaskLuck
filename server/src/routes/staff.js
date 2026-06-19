import express from 'express';

const router = express.Router();

// スタッフメモリストア
let staffStats = [
  { id: 3, name: '鈴木 一郎', role: 'part', totalXp: 180, completedTasks: 4, inProgressTasks: 1, avgTime: 45 },
  { id: 4, name: '高橋 美咲', role: 'part', totalXp: 90, completedTasks: 2, inProgressTasks: 0, avgTime: 52 },
  { id: 5, name: '山田 健太', role: 'part', totalXp: 230, completedTasks: 5, inProgressTasks: 1, avgTime: 38 },
];

// GET /api/staff - スタッフ一覧（統計付き）
router.get('/', (_req, res) => {
  res.json(staffStats);
});

// GET /api/staff/:id - スタッフ詳細
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const staff = staffStats.find(s => s.id === id);

  if (!staff) {
    return res.status(404).json({ error: 'スタッフが見つかりません' });
  }

  res.json(staff);
});

// PUT /api/staff/:id/xp - XP更新
router.put('/:id/xp', (req, res) => {
  const id = parseInt(req.params.id);
  const { xp } = req.body;

  const staff = staffStats.find(s => s.id === id);
  if (!staff) {
    return res.status(404).json({ error: 'スタッフが見つかりません' });
  }

  if (typeof xp === 'number') {
    staff.totalXp += xp;
  }

  res.json(staff);
});

// PUT /api/staff/:id/stats - 統計情報更新
router.put('/:id/stats', (req, res) => {
  const id = parseInt(req.params.id);
  const { completedTasks, inProgressTasks, avgTime } = req.body;

  const staff = staffStats.find(s => s.id === id);
  if (!staff) {
    return res.status(404).json({ error: 'スタッフが見つかりません' });
  }

  if (typeof completedTasks === 'number') staff.completedTasks = completedTasks;
  if (typeof inProgressTasks === 'number') staff.inProgressTasks = inProgressTasks;
  if (typeof avgTime === 'number') staff.avgTime = avgTime;

  res.json(staff);
});

export default router;
