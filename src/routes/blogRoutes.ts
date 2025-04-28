import express from 'express';
import * as blogController from '../controllers/blogController';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/create', authenticate, blogController.createBlog);
router.get('/get-my-blogs', authenticate, blogController.getMyBlogs);
router.get('/get-my-joined-blogs', authenticate, blogController.getMyJoinedBlogs);
router.get('/get-blog-info/:id', authenticate, blogController.getBlogInfo);
router.put('/update/:id', authenticate, blogController.updateBlog);
router.delete('/delete/:id', authenticate, blogController.deleteBlog);
router.get('/search', authenticate, blogController.searchBlogs);
router.post('/join-blog/:id', authenticate, blogController.joinBlog);
router.post('/leave-blog/:id', authenticate, blogController.leaveBlog);
router.get('/get-users/:id', authenticate, blogController.getBlogUsers);

export default router;