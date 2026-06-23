import mongoose from 'mongoose';

const taskAssignmentSchema = new mongoose.Schema({
  task_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // スタッフ(User)と紐付け
  assigned_at: { type: Date, default: Date.now },
  completed_at: { type: Date },
  approved_at: { type: Date },
  approved_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // 承認者(管理者)
  status: { 
    type: String, 
    enum: ['ASSIGNED', 'COMPLETED', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED'], 
    default: 'ASSIGNED' 
  }
});

export default mongoose.models.TaskAssignment || mongoose.model('TaskAssignment', taskAssignmentSchema);