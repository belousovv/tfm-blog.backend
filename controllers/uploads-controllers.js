import pool from '../db/db.js'

export const imageUploadController = async (req, res) => {
  try {
    res.json({
      image_url: `uploads/${req.file.originalname}`,
    })
  } catch (error) {
    return res.status(500).json({
      message: 'upload error',
    })
  }
}

export const avatarUploadController = async (req, res) => {
  try {
    await pool.query('UPDATE users SET avatar_url = $1 WHERE user_id = $2', [
      `uploads/${req.file.originalname}`,
      req.userId,
    ])
    res.json({
      image_url: `uploads/${req.file.originalname}`,
    })
  } catch (error) {
    return res.status(500).json({
      message: 'upload error',
    })
  }
}
