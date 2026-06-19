import express from 'express';

const router = express.Router();

// ガチャ設定用メモリストア
let gachaSettings = {
  enabled: true,
  speedMode: 'normal',
  poolTasks: [], // インプール中のタスク
};

// GET /api/gacha-settings - ガチャ設定取得
router.get('/', (_req, res) => {
  res.json(gachaSettings);
});

// PUT /api/gacha-settings/enabled - ガチャ有効/無効切り替え
router.put('/enabled', (req, res) => {
  const { enabled } = req.body;
  if (typeof enabled === 'boolean') {
    gachaSettings.enabled = enabled;
  }
  res.json({ success: true, enabled: gachaSettings.enabled });
});

// PUT /api/gacha-settings/speed - スピードモード変更
router.put('/speed', (req, res) => {
  const { mode } = req.body;
  if (['normal', 'fast', 'skip'].includes(mode)) {
    gachaSettings.speedMode = mode;
  }
  res.json({ success: true, speedMode: gachaSettings.speedMode });
});

// PUT /api/gacha-settings/pool - プール内タスクを更新
router.put('/pool', (req, res) => {
  const { taskIds } = req.body;
  if (Array.isArray(taskIds)) {
    gachaSettings.poolTasks = taskIds;
  }
  res.json({ success: true, poolTasks: gachaSettings.poolTasks });
});

export default router;
