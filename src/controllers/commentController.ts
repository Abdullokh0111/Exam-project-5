import { Request, Response } from 'express';
import * as CommentModel from '../models/Comment';
import * as PostModel from '../models/Post';

export async function createComment(req: Request, res: Response) {
  try {
    const { content, post_id } = req.body;
    const userId = req.userId!;
    
    if (!content || !post_id) {
      return res.status(400).json({ message: 'Content and post_id are required' });
    }
    
    const post = await PostModel.getPostById(parseInt(post_id));
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    const comment = await CommentModel.createComment({
      content,
      post_id: parseInt(post_id),
      user_id: userId
    });
    
    res.status(201).json({
      message: 'Comment created successfully',
      comment
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create comment', error: (error as Error).message });
  }
}

export async function updateComment(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.userId!;
    
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }
    
    const updatedComment = await CommentModel.updateComment(parseInt(id), content, userId);
    
    if (!updatedComment) {
      return res.status(404).json({ message: 'Comment not found or you are not the owner' });
    }
    
    res.status(200).json({
      message: 'Comment updated successfully',
      comment: updatedComment
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update comment', error: (error as Error).message });
  }
}

export async function deleteComment(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const userId = req.userId!;
    
    const success = await CommentModel.deleteComment(parseInt(id), userId);
    
    if (!success) {
      return res.status(404).json({ message: 'Comment not found or you are not the owner' });
    }
    
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete comment', error: (error as Error).message });
  }
}
