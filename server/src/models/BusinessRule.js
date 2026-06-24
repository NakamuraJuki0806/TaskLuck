import mongoose from 'mongoose';

const businessRuleSchema = new mongoose.Schema({
  rule_type: { 
    type: String, 
    required: true, 
    enum: ['HOLIDAY', 'BUSINESS_HOURS', 'REQUIRED_STAFF', 'SPECIAL_DAY'] 
  },
  target_date: { type: Date },           // 特別営業日などの特定日
  day_of_week: { type: Number },         // 0:日, 1:月... 6:土
  start_time: { type: String },          // 開始時刻 "09:00"
  end_time: { type: String },            // 終了時刻 "18:00"
  required_people: { type: Number },     // 必要人数
  created_at: { type: Date, default: Date.now }
});

export default mongoose.models.BusinessRule || mongoose.model('BusinessRule', businessRuleSchema);