import express from 'express';
import * as taskController from '../controllers/taskController.js';

const router = express.Router();

// 1. タスク一覧取得
router.get('/', taskController.getTasks);

// 2. ガチャ用：プール内のタスク取得 (is_gacha_target: true のものを取得)
router.get('/available', taskController.getAvailableTasks);

// 3. タスク追加
router.post('/', taskController.createTask);

// 4. タスク更新 (ID指定)
router.put('/:id', taskController.updateTask);

// 5. タスク削除 (ID指定)
router.delete('/:id', taskController.deleteTask);

export default router;