import pool from '../db';

export interface Blog {
  id: number;
  title: string;
  description: string;
  user_id: number;
  created_at: Date;
}

export interface BlogInput {
  title: string;
  description: string;
  user_id: number;
}

export async function createBlog(blogData: BlogInput): Promise<Blog> {
  const { title, description, user_id } = blogData;
  
  const result = await pool.query(
    'INSERT INTO blogs (title, description, user_id) VALUES ($1, $2, $3) RETURNING *',
    [title, description, user_id]
  );
  
  return result.rows[0];
}

export async function getBlogById(id: number): Promise<Blog | null> {
  const result = await pool.query('SELECT * FROM blogs WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function getUserBlogs(userId: number): Promise<Blog[]> {
  const result = await pool.query('SELECT * FROM blogs WHERE user_id = $1', [userId]);
  return result.rows;
}

export async function getUserJoinedBlogs(userId: number): Promise<Blog[]> {
  const result = await pool.query(`
    SELECT b.* FROM blogs b
    JOIN blog_members bm ON b.id = bm.blog_id
    WHERE bm.user_id = $1
  `, [userId]);
  return result.rows;
}

export async function updateBlog(id: number, blogData: Partial<BlogInput>, userId: number): Promise<Blog | null> {
  const blog = await getBlogById(id);
  
  if (!blog || blog.user_id !== userId) {
    return null;
  }
  
  const { title, description } = blogData;
  
  const result = await pool.query(
    'UPDATE blogs SET title = $1, description = $2 WHERE id = $3 RETURNING *',
    [title || blog.title, description || blog.description, id]
  );
  
  return result.rows[0];
}

export async function deleteBlog(id: number, userId: number): Promise<boolean> {
  const blog = await getBlogById(id);
  
  if (!blog || blog.user_id !== userId) {
    return false;
  }
  
  await pool.query('DELETE FROM blogs WHERE id = $1', [id]);
  return true;
}

export async function searchBlogs(query: string): Promise<Blog[]> {
  const result = await pool.query(
    'SELECT * FROM blogs WHERE title ILIKE $1',
    [`%${query}%`]
  );
  return result.rows;
}

export async function joinBlog(blogId: number, userId: number): Promise<boolean> {
  try {
    await pool.query(
      'INSERT INTO blog_members (blog_id, user_id) VALUES ($1, $2)',
      [blogId, userId]
    );
    return true;
  } catch (error) {
    return false;
  }
}

export async function leaveBlog(blogId: number, userId: number): Promise<boolean> {
  try {
    const result = await pool.query(
      'DELETE FROM blog_members WHERE blog_id = $1 AND user_id = $2',
      [blogId, userId]
    );
    return (result.rowCount ?? 0) > 0;
  } catch (error) {
    return false;
  }
}

export async function getBlogUsers(blogId: number): Promise<any[]> {
  const result = await pool.query(`
    SELECT u.id, u.username, u.email, bm.joined_at 
    FROM users u
    JOIN blog_members bm ON u.id = bm.user_id
    WHERE bm.blog_id = $1
  `, [blogId]);
  
  return result.rows;
}