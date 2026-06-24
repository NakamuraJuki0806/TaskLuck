import { getDb } from '../config/database.js';
import { ObjectId } from 'mongodb';

// 1. タスク一覧取得
export const getTasks = async (req, res) => {
  try {
    const db = getDb();
    const rawTasks = await db.collection('tasks').find().sort({ created_at: -1 }).toArray();
    
    // MongoDBのデータをフロント（React）の型に翻訳・変換
    const tasks = rawTasks.map(t => ({
      id: t._id.toString(),
      name: t.task_name || "",
      desc: t.description || "",
      pri: (t.priority || "mid").toLowerCase(),
      xp: parseInt(t.xp, 10) || 0,
      st: t.status || "pending",
      inPool: t.is_gacha_target || false
    }));

    res.status(200).json(tasks);
  } catch (error) {
    console.error("getTasksでエラー:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// 2. タスク作成
export const createTask = async (req, res) => {
  try {
    const db = getDb();
    
    const taskData = {
      task_name: req.body.name || req.body.task_name,
      description: req.body.desc || req.body.description || "",
      xp: parseInt(req.body.xp, 10) || 0,
      priority: (req.body.pri || "mid").toUpperCase(),
      status: req.body.st || "pending",
      is_gacha_target: req.body.inPool || false,
      created_at: new Date()
    };

    const result = await db.collection('tasks').insertOne(taskData);
    
    const saved = await db.collection('tasks').findOne({ _id: result.insertedId });
    const formattedTask = {
      id: saved._id.toString(),
      name: saved.task_name,
      desc: saved.description,
      pri: saved.priority.toLowerCase(),
      xp: saved.xp,
      st: saved.status,
      inPool: saved.is_gacha_target
    };

    res.status(201).json(formattedTask);
  } catch (error) {
    console.error("createTaskでエラー:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// 3. ガチャ用タスク取得
export const getAvailableTasks = async (req, res) => {
  try {
    const db = getDb();
    const rawTasks = await db.collection('tasks').find({ is_gacha_target: true }).toArray();
    
    const tasks = rawTasks.map(t => ({
      id: t._id.toString(),
      name: t.task_name || "",
      desc: t.description || "",
      pri: (t.priority || "mid").toLowerCase(),
      xp: parseInt(t.xp, 10) || 0,
      st: t.status || "pending",
      inPool: true
    }));

    res.status(200).json(tasks);
  } catch (error) {
    console.error("getAvailableTasksでエラー:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// 4. タスク更新
export const updateTask = async (req, res) => {
  try {
    const db = getDb();
    const id = new ObjectId(req.params.id);
    
    const updateData = {
      task_name: req.body.name || req.body.task_name,
      description: req.body.desc || req.body.description,
      xp: req.body.xp !== undefined ? parseInt(req.body.xp, 10) : undefined,
      priority: req.body.pri ? req.body.pri.toUpperCase() : undefined,
      status: req.body.st,
      is_gacha_target: req.body.inPool
    };

    // undefinedの項目を除外
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    await db.collection('tasks').updateOne({ _id: id }, { $set: updateData });
    
    const saved = await db.collection('tasks').findOne({ _id: id });
    const formattedTask = {
      id: saved._id.toString(),
      name: saved.task_name,
      desc: saved.description,
      pri: saved.priority.toLowerCase(),
      xp: saved.xp,
      st: saved.status,
      inPool: saved.is_gacha_target
    };

    res.status(200).json(formattedTask);
  } catch (error) {
    console.error("updateTaskでエラー:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// 5. タスク削除
export const deleteTask = async (req, res) => {
  try {
    const db = getDb();
    const id = new ObjectId(req.params.id);
    
    await db.collection('tasks').deleteOne({ _id: id });
    res.status(200).json({ success: true, message: '削除しました' });
  } catch (error) {
    console.error("deleteTaskでエラー:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};