import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDatabase } from './src/config/database.js';
import taskRoutes from './src/routes/tasks.js'; // パスは環境に合わせて調整

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// 【重要】これがないとPOSTのJSONを受け取れません
app.use(express.json()); 
app.use(cors());
app.use(morgan('dev'));

// ルートの設定
app.use('/api/tasks', taskRoutes);

// サーバー起動処理
const startServer = async () => {
  try {
    await connectDatabase();
  } catch (error) {
    console.warn('MongoDB connection was not established:', error.message);
  }

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};

startServer();