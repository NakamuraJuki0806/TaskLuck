import mongoose from 'mongoose';

const shiftSchema = new mongoose.Schema({
  staff_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true }, // 誰のシフトか
  shift_date: { type: Date, required: true }, // シフトの日付
  start_time: { type: String, required: true }, // 開始時間 (例: "09:00")
  end_time: { type: String, required: true },   // 終了時間 (例: "18:00")
  status: { type: String, enum: ['PENDING', 'CONFIRMED', 'CANCELLED'], default: 'PENDING' }
});

export default mongoose.models.Shift || mongoose.model('Shift', shiftSchema);