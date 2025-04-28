import { Request, Response } from 'express';
import * as BlogModel from '../models/Blog';
import * as UserModel from '../models/User';

export async function createBlog(req: Request, res: Response) {
  try {
    const { title, description } = req.body;
    const userId = req.userId!;
    
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    const blog = await BlogModel.createBlog({
      title,
      description: description || '',
      user_id: userId
    });
    await BlogModel.joinBlog(blog.id, userId);
    
    res.status(201).json({
      message: 'Blog created successfully',
      blog
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create blog', error: (error as Error).message });
  }
}

export async function getMyBlogs(req: Request, res: Response) {
  try {
    const userId = req.userId!;
    const blogs = await BlogModel.getUserBlogs(userId);
    
    res.status(200).json({ blogs });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch blogs', error: (error as Error).message });
  }
}

export async function getMyJoinedBlogs(req: Request, res: Response) {
  try {
    const userId = req.userId!;
    const blogs = await BlogModel.getUserJoinedBlogs(userId);
    
    res.status(200).json({ blogs });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch joined blogs', error: (error as Error).message });
  }
}

export async function getBlogInfo(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const blog = await BlogModel.getBlogById(parseInt(id));
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    const owner = await UserModel.getUserById(blog.user_id);
    const members = await BlogModel.getBlogUsers(blog.id);
    
    res.status(200).json({
      blog,
      owner: {
        id: owner?.id,
        username: owner?.username
      },
      membersCount: members.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch blog info', error: (error as Error).message });
  }
}

export async function updateBlog(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const userId = req.userId!;
    
    const updatedBlog = await BlogModel.updateBlog(parseInt(id), { title, description, user_id: userId }, userId);
    
    if (!updatedBlog) {
      return res.status(404).json({ message: 'Blog not found or you are not the owner' });
    }
    
    res.status(200).json({
      message: 'Blog updated successfully',
      blog: updatedBlog
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update blog', error: (error as Error).message });
  }
}

export async function deleteBlog(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const userId = req.userId!;
    
    const success = await BlogModel.deleteBlog(parseInt(id), userId);
    
    if (!success) {
      return res.status(404).json({ message: 'Blog not found or you are not the owner' });
    }
    
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete blog', error: (error as Error).message });
  }
}

export async function searchBlogs(req: Request, res: Response) {
  try {
    const { query } = req.query;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const blogs = await BlogModel.searchBlogs(query);
    
    res.status(200).json({ blogs });
  } catch (error) {
    res.status(500).json({ message: 'Search failed', error: (error as Error).message });
  }
}

export async function joinBlog(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const userId = req.userId!;
    
    const blog = await BlogModel.getBlogById(parseInt(id));
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    const success = await BlogModel.joinBlog(parseInt(id), userId);
    
    if (!success) {
      return res.status(409).json({ message: 'You are already a member of this blog' });
    }
    
    res.status(200).json({ message: 'Joined blog successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to join blog', error: (error as Error).message });
  }
}

export async function leaveBlog(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const userId = req.userId!;
    
    const blog = await BlogModel.getBlogById(parseInt(id));
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    // Владелец блога не может покинуть свой блог
    if (blog.user_id === userId) {
      return res.status(400).json({ message: 'Blog owner cannot leave their own blog' });
    }
    
    const success = await BlogModel.leaveBlog(parseInt(id), userId);
    
    if (!success) {
      return res.status(404).json({ message: 'You are not a member of this blog' });
    }
    
    res.status(200).json({ message: 'Left blog successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to leave blog', error: (error as Error).message });
  }
}

export async function getBlogUsers(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    const blog = await BlogModel.getBlogById(parseInt(id));
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    const users = await BlogModel.getBlogUsers(parseInt(id));
    
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch blog users', error: (error as Error).message });
  }
}