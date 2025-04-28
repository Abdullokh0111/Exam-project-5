import { Request, Response } from 'express';
import * as PostModel from '../models/Post';
import * as BlogModel from '../models/Blog';
import * as CommentModel from '../models/Comment';

export async function createPost(req: Request, res: Response) {
  try {
    const { title, content, blog_id } = req.body;
    const userId = req.userId!;
    
    if (!title || !content || !blog_id) {
      return res.status(400).json({ message: 'Title, content and blog_id are required' });
    }
    
    const blog = await BlogModel.getBlogById(parseInt(blog_id));
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    if (blog.user_id !== userId) {
      return res.status(403).json({ message: 'Only blog owner can create posts' });
    }
    
    const post = await PostModel.createPost({
      title,
      content,
      blog_id: parseInt(blog_id),
      user_id: userId
    });
    
    res.status(201).json({
      message: 'Post created successfully',
      post
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create post', error: (error as Error).message });
  }
}

export async function getBlogPosts(req: Request, res: Response) {
  try {
    const { blog_id } = req.params;
    
    const blog = await BlogModel.getBlogById(parseInt(blog_id));
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    const posts = await PostModel.getBlogPosts(parseInt(blog_id));
    
    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch posts', error: (error as Error).message });
  }
}

export async function getPostById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    const post = await PostModel.getPostById(parseInt(id));
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    await PostModel.incrementPostViews(parseInt(id));
    
    const updatedPost = await PostModel.getPostById(parseInt(id));
    
    res.status(200).json({ post: updatedPost });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch post', error: (error as Error).message });
  }
}

export async function updatePost(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.userId!;
    
    const updatedPost = await PostModel.updatePost(parseInt(id), { title, content }, userId);
    
    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found or you are not the owner' });
    }
    
    res.status(200).json({
      message: 'Post updated successfully',
      post: updatedPost
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update post', error: (error as Error).message });
  }
}

export async function deletePost(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const userId = req.userId!;
    
    const success = await PostModel.deletePost(parseInt(id), userId);
    if (!success) {
        return res.status(404).json({ message: 'Post not found or you are not the owner' });
      }
      
      res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete post', error: (error as Error).message });
    }
  }

  export async function sortPostsByDate(req: Request, res: Response) {
    try {
      const { blog_id } = req.params;
      
      const blog = await BlogModel.getBlogById(parseInt(blog_id));
      
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }
      
      const posts = await PostModel.getSortedPostsByDate(parseInt(blog_id));
      
      res.status(200).json({ posts });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch sorted posts', error: (error as Error).message });
    }
  }
  
  export async function getPostComments(req: Request, res: Response) {
    try {
      const { post_id } = req.params;
      
      const post = await PostModel.getPostById(parseInt(post_id));
      
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      
      const comments = await CommentModel.getPostComments(parseInt(post_id));
      
      res.status(200).json({ comments });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch comments', error: (error as Error).message });
    }
  }
  