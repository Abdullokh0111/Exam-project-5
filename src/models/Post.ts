import pool from '../db';

export interface Post {
  id: number;
  title: string;
  content: string;
  blog_id: number;
  user_id: number;
  views: number;
  created_at: Date;
  updated_at: Date;
}

export interface PostInput {
  title: string;
  content: string;
  blog_id: number;
  user_id: number;
}

export async function createPost(postData: PostInput): Promise<Post> {
  const { title, content, blog_id, user_id } = postData;
  
  const result = await pool.query(
    'INSERT INTO posts (title, content, blog_id, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
    [title, content, blog_id, user_id]
  );
  
  return result.rows[0];
}

export async function getBlogPosts(blogId: number): Promise<Post[]> {
  const result = await pool.query('SELECT * FROM posts WHERE blog_id = $1', [blogId]);
  return result.rows;
}

export async function getPostById(id: number): Promise<Post | null> {
  const result = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function incrementPostViews(id: number): Promise<void> {
  await pool.query('UPDATE posts SET views = views + 1 WHERE id = $1', [id]);
}

export async function updatePost(id: number, postData: Partial<PostInput>, userId: number): Promise<Post | null> {
  const post = await getPostById(id);
  
  if (!post || post.user_id !== userId) {
    return null;
  }
  
  const { title, content } = postData;
  
  const result = await pool.query(
    'UPDATE posts SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
    [title || post.title, content || post.content, id]
  );
  
  return result.rows[0];
}

export async function deletePost(id: number, userId: number): Promise<boolean> {
  const post = await getPostById(id);
  
  if (!post || post.user_id !== userId) {
    return false;
  }
  
  await pool.query('DELETE FROM posts WHERE id = $1', [id]);
  return true;
}

export async function getSortedPostsByDate(blogId: number): Promise<Post[]> {
  const result = await pool.query(
    'SELECT * FROM posts WHERE blog_id = $1 ORDER BY created_at DESC',
    [blogId]
  );
  return result.rows;
}


