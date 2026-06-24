import mongoose from 'mongoose';

const shiftRequestSchema = new mongoose.Schema({
  staff_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
  request_date: { type: Date, required: true }, // 希望日
  start_time: { type: String, required: true }, // 希望開始時間
  end_time: { type: String, required: true },   // 希望終了時間
  reason: { type: String },                     // 備考（「テストのため休み」など）
  status: { 
    type: String, 
    enum: ['PENDING', 'APPROVED', 'REJECTED'], 
    default: 'PENDING' 
  },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.models.ShiftRequest || mongoose.model('ShiftRequest', shiftRequestSchema);