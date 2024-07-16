import express from 'express';
import userRoutes from './routes/users.js';
import commentRoutes from './routes/comments.js';
import postRoutes from './routes/posts.js';
import likeRoutes from './routes/likes.js';
import authRoutes from './routes/auth.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = new express();

app.use(cors()); // in case other url wanna connect server
app.use(cookieParser());
app.use(express.json()); // to send head body data

app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/auth', authRoutes);

app.listen('8800', () => {
  console.log('API working');
});
