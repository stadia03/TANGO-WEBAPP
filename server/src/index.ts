import express from 'express';
import 'dotenv/config' ;
import mongoose from 'mongoose';
import cors from 'cors'; 

import userRoutes from './routes/user'
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import verifyToken from './middleware/verifyToken';

const app = express();

app.use(express.json());
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}));


app.get('/',async(req,res)=>{
  res.send('server working!');
})

app.use('/auth',authRoutes);
app.use('/user',verifyToken('user'),userRoutes);
app.use('/admin',verifyToken('admin'),adminRoutes);

mongoose.connect(process.env.mongo_URL || 'ts')
.catch((err)=>{
  console.log(err,"Can't connect to DB");
})
app.listen(3500,()=>{
  console.log('server started in 3500!');
})

export default app;