import express from 'express';

const router = express.Router();

// メモリに保存（本来はDBを使用）
let tasks = [
  { id: 1, name: '在庫チェック（飲料）', desc: '冷蔵庫・棚の在庫を確認し記録する', pri: 'high', xp: 80, st: 'pending', inPool: true },
  { id: 2, name: 'フロア清掃', desc: '開店前にフロア全体を拭き掃除する', pri: 'mid', xp: 50, st: 'pending', inPool: true },
  { id: 3, name: '陳列棚の整理', desc: '商品を正しい位置に戻す', pri: 'low', xp: 40, st: 'pending', inPool: false },
  { id: 4, name: 'バックヤード片付け', desc: '段ボールをまとめて廃棄場所へ', pri: 'mid', xp: 60, st: 'pending', inPool: true },
  { id: 5, name: '窓ふき', desc: '店舗入口の窓を清掃する', pri: 'low', xp: 40, st: 'pending', inPool: true },
  { id: 6, name: 'ドリンクサーバー洗浄', desc: 'コーヒーマシンのフィルター交換と洗浄', pri: 'mid', xp: 55, st: 'pending', inPool: true },
  { id: 7, name: 'ゴミ捨て', desc: '各ゴミ箱を回収して所定の場所へ', pri: 'low', xp: 35, st: 'pending', inPool: false },
];

let nextId = 100;

// GET /api/tasks - タスク一覧取得
router.get('/', (_req, res) => {
  res.json(tasks);
});

// GET /api/tasks/available - プール内のペンディングタスク
router.get('/available', (_req, res) => {
  const available = tasks.filter(t => t.st === 'pending' && t.inPool);
  res.json(available);
});

// POST /api/tasks - タスク追加
router.post('/', (req, res) => {
  const { name, desc, pri, xp } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'タスク名は必須です' });
  }

  const newTask = {
    id: nextId++,
    name,
    desc: desc || '',
    pri: pri || 'mid',
    xp: xp || 50,
    st: 'pending',
    inPool: true,
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT /api/tasks/:id - タスク更新
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);

  if (!task) {
    return res.status(404).json({ error: 'タスクが見つかりません' });
  }

  const { name, desc, pri, xp, st, inPool } = req.body;
  if (name !== undefined) task.name = name;
  if (desc !== undefined) task.desc = desc;
  if (pri !== undefined) task.pri = pri;
  if (xp !== undefined) task.xp = xp;
  if (st !== undefined) task.st = st;
  if (inPool !== undefined) task.inPool = inPool;

  res.json(task);
});

// DELETE /api/tasks/:id - タスク削除
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'タスクが見つかりません' });
  }

  const deletedTask = tasks.splice(index, 1);
  res.json(deletedTask[0]);
});

export default router;
