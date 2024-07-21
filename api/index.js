import express from 'express';
import userRoutes from './routes/users.js';
import commentRoutes from './routes/comments.js';
import postRoutes from './routes/posts.js';
import likeRoutes from './routes/likes.js';
import authRoutes from './routes/auth.js';
import relationshipsRoutes from './routes/relationships.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import multer from 'multer';

const app = new express();

// allow cors connection
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

app.use(
  cors({
    origin: 'http://localhost:3000',
  }),
);

//
app.use(cookieParser());

// send head body data
app.use(express.json());

// upload to client directory
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../client/public/upload');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.use('/api/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/relationships', relationshipsRoutes);

app.listen('8800', () => {
  console.log('API working');
});
