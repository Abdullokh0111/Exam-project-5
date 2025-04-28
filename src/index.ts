import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import config from './config';
import { errorHandler } from './middlewares/errorMiddleware';

import userRoutes from './routes/userRoutes';
import blogRoutes from './routes/blogRoutes';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser(config.cookieSecret));

app.use('/users', userRoutes);
app.use('/blogs', blogRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);

app.use(errorHandler);

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
