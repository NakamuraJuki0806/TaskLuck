import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDatabase } from './src/config/database.js';
import { healthRouter } from './src/routes/health.js';
import tasksRouter from './src/routes/tasks.js';
import gachaRouter from './src/routes/gacha.js';
import gachaSettingsRouter from './src/routes/gacha-settings.js';
import approvalRouter from './src/routes/approval.js';
import staffRouter from './src/routes/staff.js';
import notificationsRouter from './src/routes/notifications.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/health', healthRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/gacha', gachaRouter);
app.use('/api/gacha-settings', gachaSettingsRouter);
app.use('/api/approval', approvalRouter);
app.use('/api/staff', staffRouter);
app.use('/api/notifications', notificationsRouter);

app.get('/api', (_req, res) => {
  res.json({ message: 'TaskLuck API is running' });
});

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
