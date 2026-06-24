import mongoose from 'mongoose';

const shiftPatternSchema = new mongoose.Schema({
  name: { type: String, required: true }, // パターン名 (例: 「早番」「フルタイム」)
  start_time: { type: String, required: true },
  end_time: { type: String, required: true },
  description: { type: String }, // 備考
  is_active: { type: Boolean, default: true } // 使用するかどうか
});

export default mongoose.models.ShiftPattern || mongoose.model('ShiftPattern', shiftPatternSchema);