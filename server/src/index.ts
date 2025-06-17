import express, { Request, Response } from 'express';
import 'dotenv/config';
import cors from 'cors';

import userRoutes from './routes/user';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import verifyToken from './middleware/verifyToken';
import dbConnect from './utils/db';

const app = express();
let isConnected = false;

app.use(cors());
app.use(express.json());

// Routes setup
app.get('/', (_req: Request, res: Response) => {res.send('server working!')});
app.use('/auth', authRoutes);
app.use('/user', verifyToken('user'), userRoutes);
app.use('/admin', verifyToken('admin'), adminRoutes);

// Vercel handler
export default async function handler(req: Request, res: Response) {
  if (!isConnected) {
    await dbConnect();
    isConnected = true;
  }
  return app(req, res);
}
