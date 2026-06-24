import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // ログインID
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },               // ※本番運用時はハッシュ化必須
  role: { type: String, enum: ['STAFF', 'MANAGER', 'ADMIN'], default: 'STAFF' },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model('User', userSchema);