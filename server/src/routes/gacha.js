import express from 'express';

const router = express.Router();

// レアリティ定義
const RARITY = {
  N: { key: 'n', label: 'NORMAL', xpMult: 1, prob: 0.45 },
  R: { key: 'r', label: 'RARE', xpMult: 1.5, prob: 0.28 },
  SR: { key: 'sr', label: 'SUPER RARE', xpMult: 2, prob: 0.16 },
  UR: { key: 'ur', label: 'ULTRA RARE', xpMult: 3, prob: 0.08 },
  L: { key: 'l', label: 'LEGENDARY', xpMult: 5, prob: 0.03 },
};

const RK_ORDER = ['N', 'R', 'SR', 'UR', 'L'];
const PRIORITY_WEIGHTS = { high: 5, mid: 3, low: 1 };

let gachaHistory = [];

// ランダムなレアリティ抽出
function pickRarity() {
  let r = Math.random();
  let acc = 0;
  for (const k of RK_ORDER) {
    acc += RARITY[k].prob;
    if (r < acc) return k;
  }
  return 'N';
}

// 優先度に基づくタスク抽出
function pickTask(availableTasks) {
  let total = availableTasks.reduce((acc, t) => acc + (PRIORITY_WEIGHTS[t.pri] || 1), 0);
  let r = Math.random() * total;
  for (const t of availableTasks) {
    const w = PRIORITY_WEIGHTS[t.pri] || 1;
    if (r < w) return t;
    r -= w;
  }
  return availableTasks[0];
}

// POST /api/gacha/pull - ガチャ実行
router.post('/pull', (req, res) => {
  const { availableTasks } = req.body;

  if (!availableTasks || availableTasks.length === 0) {
    return res.status(400).json({ error: 'プール内にタスクがありません' });
  }

  const rk = pickRarity();
  const rc = RARITY[rk];
  const chosenTask = pickTask(availableTasks);
  const chosenXp = Math.round(chosenTask.xp * rc.xpMult);

  const historyItem = {
    name: chosenTask.name,
    desc: chosenTask.desc,
    rarity: rc.label,
    rkey: rk,
    xp: chosenXp,
    time: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
  };

  gachaHistory.push(historyItem);

  res.json({
    task: chosenTask,
    rarity: rc.label,
    rarityKey: rk,
    xp: chosenXp,
    history: historyItem,
  });
});

// GET /api/gacha/history - ガチャ履歴取得
router.get('/history', (_req, res) => {
  res.json(gachaHistory);
});

// GET /api/gacha/history/count - ガチャ回数
router.get('/history/count', (_req, res) => {
  res.json({ count: gachaHistory.length });
});

// POST /api/gacha/complete - タスク完了時のXP加算
router.post('/complete', (req, res) => {
  const { taskName, xp } = req.body;
  if (!taskName || !xp) {
    return res.status(400).json({ error: 'taskName と xp は必須です' });
  }
  // ここでデータベースにXPを保存する処理を追加できます
  res.json({ success: true, totalXp: xp });
});

export default router;
