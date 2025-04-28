import pool from '../db';

export interface Comment {
  id: number;
  content: string;
  post_id: number;
  user_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface CommentInput {
  content: string;
  post_id: number;
  user_id: number;
}

export async function createComment(commentData: CommentInput): Promise<Comment> {
  const { content, post_id, user_id } = commentData;
  
  const result = await pool.query(
    'INSERT INTO comments (content, post_id, user_id) VALUES ($1, $2, $3) RETURNING *',
    [content, post_id, user_id]
  );
  
  return result.rows[0];
}

export async function getPostComments(postId: number): Promise<Comment[]> {
  const result = await pool.query(`
    SELECT c.*, u.username 
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.post_id = $1
    ORDER BY c.created_at DESC
  `, [postId]);
  
  return result.rows;
}

export async function getCommentById(id: number): Promise<Comment | null> {
  const result = await pool.query('SELECT * FROM comments WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function updateComment(id: number, content: string, userId: number): Promise<Comment | null> {
  const comment = await getCommentById(id);
  
  if (!comment || comment.user_id !== userId) {
    return null;
  }
  
  const result = await pool.query(
    'UPDATE comments SET content = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
    [content, id]
  );
  
  return result.rows[0];
}

export async function deleteComment(id: number, userId: number): Promise<boolean> {
  const comment = await getCommentById(id);
  
  if (!comment || comment.user_id !== userId) {
    return false;
  }
  
  await pool.query('DELETE FROM comments WHERE id = $1', [id]);
  return true;
}