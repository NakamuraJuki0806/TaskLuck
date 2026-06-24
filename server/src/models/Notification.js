import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  // 誰宛ての通知か（全員宛てならnullにする等の運用も可能）
  staff_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['INFO', 'WARNING', 'APPROVAL_REQUEST', 'GACHA_RESULT'], default: 'INFO' },
  
  is_read: { type: Boolean, default: false }, // 既読フラグ
  created_at: { type: Date, default: Date.now }
});

export default mongoose.models.Notification || mongoose.model('Notification', notificationSchema);