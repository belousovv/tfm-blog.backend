import pool from '../db/db.js'

// Create
export const createPostController = async (req, res) => {
  try {
    const { title, text, tags, imageUrl } = req.body
    const { userId } = req

    const post = await pool.query(
      `INSERT INTO posts (user_id, title, text, tags, image_url) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *`,
      [userId, title, text, tags || [], imageUrl || null]
    )

    res.json(post.rows[0])
  } catch (error) {
    return res.status(500).json({
      message: 'Ошибка при создании поста',
    })
  }
}

// Get all
export const getPostsController = async (req, res) => {
  try {
    let { page, count } = req.query
    // defaults page and count
    if (!page) {
      page = 1
    } else {
      page = Number(page)
    }
    if (!count) {
      count = 5
    } else {
      count = Number(count)
    }

    // posts
    const posts = await pool.query(
      `SELECT p.post_id, p.title, p.text, p.tags, p.views, p.likes, p.      image_url, p.created_at, u.user_id, u.name, u.avatar_url
      FROM posts AS p
      INNER JOIN users AS u ON p.user_id = u.user_id
      ORDER BY created_at DESC
      LIMIT $2 OFFSET ($1 - 1)*$2`,
      [page, count]
    )
    // totalCount
    const totalCount = await pool.query(`SELECT count(*) FROM posts`)

    res.json({
      posts: posts.rows,
      totalCount: Number(totalCount.rows[0].count),
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Ошибка при получении постов',
    })
  }
}

// Get all with tag filter
export const getPostsByFilterController = async (req, res) => {
  try {
    const { tag } = req.params
    let { page, count } = req.query

    // defaults page and count
    if (!page) {
      page = 1
    } else {
      page = Number(page)
    }
    if (!count) {
      count = 5
    } else {
      count = Number(count)
    }

    console.log(tag, page, count)

    // posts
    const posts = await pool.query(
      `SELECT p.post_id, p.title, p.text, p.tags, p.views, p.likes, p.image_url, p.created_at, u.user_id, u.name, u.avatar_url 
      FROM posts AS p 
      INNER JOIN users AS u ON p.user_id = u.user_id 
      WHERE $1 = ANY(p.tags) 
      ORDER BY created_at DESC
      LIMIT $3 OFFSET ($2 - 1)*$3`,
      [tag, page, count]
    )
    // totalCount
    const totalCount = await pool.query(
      `SELECT count(*) 
      FROM posts 
      WHERE $1 = ANY(tags)`,
      [tag]
    )

    res.json({
      posts: posts.rows,
      totalCount: Number(totalCount.rows[0].count),
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Ошибка при получении постов',
    })
  }
}

// Get one
export const getOnePostController = async (req, res) => {
  try {
    const { id } = req.params

    const post = await pool.query(
      `SELECT p.post_id, p.title, p.text, p.tags, p.views, p.likes, p.image_url, p.created_at, u.user_id, u.name, u.avatar_url 
      FROM posts AS p 
      INNER JOIN users AS u ON p.user_id = u.user_id 
      WHERE p.post_id = $1`,
      [id]
    )
    res.json(post.rows[0])
  } catch (error) {
    return res.status(500).json({
      message: 'Ошибка при получении поста',
    })
  }
}

// Add one view to post
export const addViewsController = async (req, res) => {
  try {
    const { id } = req.params
    const data = await pool.query(
      `UPDATE posts 
      SET views = views +1 
      WHERE post_id = $1 
      RETURNING views, post_id`,
      [id]
    )
    res.json(data.rows[0])
  } catch (error) {
    res.status(500).json({ message: 'ошибка при добавлении просмотра' })
  }
}

// Update
export const updatePostController = async (req, res) => {
  try {
    const { title, text, tags, imageUrl } = req.body
    const { id } = req.params

    console.log(req.body)

    await pool.query(
      `UPDATE posts 
      SET title = $1, text = $2, tags = $3, image_url = $4 
      WHERE post_id = $5`,
      [title, text, tags, imageUrl, id]
    )

    res.json({
      status: 'updated',
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Ошибка при обновлении поста',
    })
  }
}

// Delete
export const deletePostController = async (req, res) => {
  try {
    const { id } = req.params
    const postId = await pool.query(
      `DELETE FROM posts WHERE post_id = $1 
      RETURNING post_id`,
      [id]
    )
    res.json(postId.rows[0])
  } catch (error) {
    return res.status(500).json({
      message: 'Ошибка при удалении поста',
    })
  }
}

// Add like to post
export const addLikeController = async (req, res) => {
  try {
    // check if user_id already exist in likes
    const _post = await pool.query(
      `SELECT likes 
      FROM posts 
      WHERE post_id = $1`,
      [req.params.id]
    )
    if (_post.rows[0].likes.includes(req.userId)) {
      return res.status(400).json({
        message: 'Лайк уже поставлен',
      })
    }
    const post = await pool.query(
      `UPDATE posts 
      SET likes = array_append(likes, $1) 
      WHERE post_id = $2 
      RETURNING *`,
      [req.userId, req.params.id]
    )
    res.json(post.rows[0])
  } catch (error) {
    return res.status(500).json({
      message: 'Ошибка при добавлении лайка',
    })
  }
}

// Remove like from post
export const removeLikeController = async (req, res) => {
  try {
    // check if user_id not exist in views
    const _post = await pool.query(
      `SELECT likes 
      FROM posts 
      WHERE post_id = $1`,
      [req.params.id]
    )
    if (!_post.rows[0].likes.includes(req.userId)) {
      return res.status(400).json({
        message: 'Лайк пользователем не поставлен',
      })
    }
    const post = await pool.query(
      `UPDATE posts 
      SET likes = array_remove(likes, $1) 
      WHERE post_id = $2 
      RETURNING *`,
      [req.userId, req.params.id]
    )
    res.json(post.rows[0])
  } catch (error) {
    return res.status(500).json({
      message: 'Ошибка при удалении лайка',
    })
  }
}
