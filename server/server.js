import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDatabase } from './src/config/database.js';
import { healthRouter } from './src/routes/health.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/health', healthRouter);

app.get('/api', (_req, res) => {
  res.json({ message: 'TaskLuck API is running' });
});

app.get('/api/tasks', (_req, res) => {
  res.json([]);
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
