import express from 'express';
import { 
  getTasks, 
  createTask, 
  updateTask,   // これらはコントローラーでexportされている前提です
  deleteTask, 
  getAvailableTasks 
} from '../controllers/taskController.js';

const router = express.Router();

// 1. タスク一覧取得 (GET /api/tasks)
router.get('/', getTasks);

// 2. ガチャ用：プール内のタスク取得 (GET /api/tasks/available)
router.get('/available', getAvailableTasks);

// 3. タスク作成 (POST /api/tasks)
router.post('/', createTask);

// 4. タスク更新 (PUT /api/tasks/:id)
router.put('/:id', updateTask);

// 5. タスク削除 (DELETE /api/tasks/:id)
router.delete('/:id', deleteTask);

export default router;