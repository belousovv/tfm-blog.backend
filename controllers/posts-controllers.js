import pool from '../db/db.js'

// Create
export const createPostController = async (req, res) => {
  try {
    const { title, text, tags, imageUrl } = req.body
    const { userId } = req

    const post = await pool.query(
      'INSERT INTO posts (user_id, title, text, tags, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, title, text, tags || [], imageUrl || null]
    )

    res.json(post.rows[0])
  } catch (error) {
    return res.status(500).json({
      message: 'ошибка при создании поста',
    })
  }
}

// Get all
export const getPostsController = async (req, res) => {
  try {
    const posts = await pool.query(
      'SELECT p.post_id, p.title, p.text, p.tags, p.views, p.likes, p.image_url, p.created_at, u.user_id, u.name, u.avatar_url FROM posts AS p INNER JOIN users AS u ON p.user_id = u.user_id'
    )

    res.json(posts.rows)
  } catch (error) {
    return res.status(500).json({
      message: 'ошибка при получении постов',
    })
  }
}

// Get one
export const getOnePostController = async (req, res) => {
  try {
    const { id } = req.params
    await pool.query('UPDATE posts SET views = views + 1 WHERE post_id = $1', [
      id,
    ])
    const post = await pool.query(
      'SELECT p.post_id, p.title, p.text, p.tags, p.views, p.likes, p.image_url, p.created_at, u.user_id, u.name, u.avatar_url FROM posts AS p INNER JOIN users AS u ON p.user_id = u.user_id WHERE p.post_id = $1',
      [id]
    )
    res.json(post.rows[0])
  } catch (error) {
    return res.status(500).json({
      message: 'ошибка при получении поста',
    })
  }
}

// Update
export const updatePostController = async (req, res) => {
  try {
    const { title, text, tags, imageUrl } = req.body
    const { id } = req.params

    if (title) {
      await pool.query('UPDATE posts SET title = $1 WHERE post_id = $2', [
        title,
        id,
      ])
    }
    if (text) {
      await pool.query('UPDATE posts SET text = $1 WHERE post_id = $2', [
        text,
        id,
      ])
    }
    if (tags) {
      await pool.query('UPDATE posts SET tags = $1 WHERE post_id = $2', [
        tags,
        id,
      ])
    }
    if (imageUrl) {
      await pool.query('UPDATE posts SET image_url = $1 WHERE post_id = $2', [
        imageUrl,
        id,
      ])
    }

    res.json({
      status: 'updated',
    })
  } catch (error) {
    return res.status(500).json({
      message: 'ошибка при обновлении поста',
    })
  }
}

// Delete
export const deletePostController = async (req, res) => {
  try {
    const { id } = req.params
    await pool.query('DELETE FROM posts WHERE post_id = $1', [id])
    res.json({
      status: 'deleted',
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Ошибка при удалении поста',
    })
  }
}
