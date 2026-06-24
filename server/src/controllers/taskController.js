import { connectDatabase } from '../config/database.js';
import Task from '../models/Task.js';

export const createTask = async (req, res) => {
  try {
    await connectDatabase();
    const newTask = new Task(req.body);
    const savedTask = await newTask.save();
    res.status(201).json({ success: true, data: savedTask });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    await connectDatabase();
    const tasks = await Task.find().sort({ created_at: -1 });
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ...既存の createTask, getTasks の下に以下を追加...

export const getAvailableTasks = async (req, res) => {
  try {
    await connectDatabase();
    // inPool が true のものを探す
    const tasks = await Task.find({ is_gacha_target: true });
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    await connectDatabase();
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: updatedTask });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    await connectDatabase();
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: '削除しました' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};