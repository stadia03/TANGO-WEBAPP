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

// Async server startup
(async () => {
  try {
    await dbConnect(); 

    app.get('/', (req, res) => {
      res.send('server working!');
    });

    app.use('/auth', authRoutes);
    app.use('/user', verifyToken('user'), userRoutes);
    app.use('/admin', verifyToken('admin'), adminRoutes);

    // const PORT = process.env.PORT || 3500;
    // app.listen(PORT, () => {
    //   console.log(`✅ Server running on port ${PORT}`);
    // });

  } catch (err) {
    console.error('❌ Failed to start server:', err);
  }
})();

export default app;
