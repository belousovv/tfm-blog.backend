import jwt from 'jsonwebtoken'

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization
  if (!token) {
    return res.status(403).json({
      message: 'Ошибка доступа',
    })
  }

  try {
    const verifed = jwt.verify(token, process.env.SECRET)
    req.userId = verifed.id
    next()
  } catch (error) {
    return res.status(403).json({
      message: 'Ошибка доступа',
    })
  }
}
