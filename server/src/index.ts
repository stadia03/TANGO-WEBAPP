import express from 'express';
import 'dotenv/config' ;
import mongoose from 'mongoose';
import cors from 'cors'; 

import userRoutes from './routes/user'
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import verifyToken from './middleware/verifyToken';

const app = express();

app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}));

app.use((req, res, next)  => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
     res.sendStatus(200);
     return;
  }
  next();
});

app.options('*', cors()); // Preflight handling



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
// app.listen(3500,()=>{
//   console.log('server started in 3500!');
// })

export default app;