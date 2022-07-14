import pool from '../db/db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { json } from 'express'

// Register
export const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // check unique email
    const user_id = await pool.query(
      'SELECT user_id FROM users WHERE email = $1',
      [email]
    )
    if (user_id.rows.length > 0) {
      return res.status(400).json({
        message: 'Указанная почта уже зарегистрирована',
      })
    }

    // password hash
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    // register
    const user = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
      [name, email, hash]
    )

    const { password_hash, ...userData } = user.rows[0]

    // generate jwt
    const token = jwt.sign(
      {
        id: userData.user_id,
      },
      process.env.SECRET,
      { expiresIn: '1d' }
    )

    res.json({
      ...userData,
      token,
    })
  } catch (error) {
    return res.status(400).json({
      message: 'Ошибка при регистрации',
    })
  }
}

// Login

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body

    // check by email
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [
      email,
    ])
    if (user.rows.length === 0) {
      return res.status(400).json({
        message: 'Почта или пароль указаны не верно',
      })
    }

    // verify password
    const isComparedPassword = await bcrypt.compare(
      password,
      user.rows[0].password_hash
    )
    if (!isComparedPassword) {
      return res.status(400).json({
        message: 'Почта или пароль указаны не верно',
      })
    }

    const { password_hash, ...userData } = user.rows[0]

    // generate jwt
    const token = jwt.sign(
      {
        id: userData.user_id,
      },
      process.env.SECRET,
      { expiresIn: '1d' }
    )

    res.json({
      ...userData,
      token,
    })
  } catch (error) {
    return json.status(500).json({
      message: 'Ошибка авторизации',
    })
  }
}

export const getMeController = async (req, res) => {
  try {
    const { userId } = req

    if (!userId) {
      return res.status(400).json({
        message: 'Ошибка авторизации',
      })
    }

    const user = await pool.query('SELECT * FROM users WHERE user_id = $1', [
      userId,
    ])
    const { password_hash, ...userData } = user.rows[0]
    res.json(userData)
  } catch (error) {
    return res.status(400).json({
      message: 'Ошибка авторизации',
    })
  }
}
