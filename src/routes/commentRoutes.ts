import express from 'express';
import * as commentController from '../controllers/commentController';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/create', authenticate, commentController.createComment);
router.put('/update/:id', authenticate, commentController.updateComment);
router.delete('/delete/:id', authenticate, commentController.deleteComment);

export default router;
