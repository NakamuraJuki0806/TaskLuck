import mongoose from 'mongoose';

let conn = null;

// export const という形で名前付きエクスポートにします
export const connectDatabase = async () => {
  if (conn) return conn;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URIが設定されていません。');

  console.log('=> データベースに接続します...');
  conn = mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 }).then(m => m);
  await conn;
  return conn;
};