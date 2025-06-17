import express from 'express';
import 'dotenv/config';
import cors from 'cors';

import userRoutes from './routes/user';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import verifyToken from './middleware/verifyToken';
import dbConnect from './utils/db'; 

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

app.get('/', async (req, res) => {
  res.send('server working!');
});

app.use('/auth', authRoutes);
app.use('/user', verifyToken('user'), userRoutes);
app.use('/admin', verifyToken('admin'), adminRoutes);

dbConnect().then(() => {
  console.log("MongoDB connected successfully at startup");
}).catch((err) => {
  console.error("Initial DB connection failed:", err);
});

// app.listen(3500, () => {
//   console.log('server started in 3500!');
// });

export default app;
