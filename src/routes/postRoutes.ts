import express from 'express';
import * as postController from '../controllers/postController';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/create', authenticate, postController.createPost);
router.get('/get-all/:blog_id', authenticate, postController.getBlogPosts);
router.get('/get-by-id/:id', authenticate, postController.getPostById);
router.put('/update/:id', authenticate, postController.updatePost);
router.delete('/delete/:id', authenticate, postController.deletePost);
router.get('/sort-by-date/:blog_id', authenticate, postController.sortPostsByDate);
router.get('/:post_id/get-comments', authenticate, postController.getPostComments);

export default router;