import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  task_name: { type: String, required: true },
  description: { type: String, required: true },
  xp: { type: Number, required: true, default: 0 },
  is_gacha_target: { type: Boolean, default: true },
  priority: { type: String, enum: ['HIGH', 'MEDIUM', 'LOW'], default: 'MEDIUM' },
  task_type: { type: String, default: 'NORMAL' },
  deadline: { type: Date },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.models.Task || mongoose.model('Task', taskSchema);