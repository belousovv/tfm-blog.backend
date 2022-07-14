import cors from 'cors'
import express from 'express'
import path from 'path'
import morgan from 'morgan'
import {
  loginValidator,
  registerValidator,
} from './validators/auth-validators.js'
import { validationMiddleware } from './middlewares/validation-middlewares.js'
import {
  getMeController,
  loginController,
  registerController,
} from './controllers/auth-controllers.js'
import { authMiddleware } from './middlewares/auth-middleware.js'
import {
  addLikeController,
  addViewsController,
  createPostController,
  deletePostController,
  getOnePostController,
  getPostsByFilterController,
  getPostsController,
  removeLikeController,
  updatePostController,
} from './controllers/posts-controllers.js'
import { fileURLToPath } from 'url'
import { imagesMiddleware } from './middlewares/images-middleware.js'
import {
  avatarUploadController,
  imageUploadController,
} from './controllers/uploads-controllers.js'

const PORT = process.env.PORT || 4444
const app = express()

// Express middlewares
app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))
app.use(
  '/uploads',
  express.static(
    path.join(path.dirname(fileURLToPath(import.meta.url)), 'uploads')
  )
)

// Routes
app.post(
  '/uploads',
  authMiddleware,
  imagesMiddleware.single('image'),
  imageUploadController
)
app.post(
  '/avatar',
  authMiddleware,
  imagesMiddleware.single('image'),
  avatarUploadController
)

app.post(
  '/auth/register',
  registerValidator,
  validationMiddleware,
  registerController
)
app.post('/auth/login', loginValidator, validationMiddleware, loginController)
app.get('/auth/me', authMiddleware, getMeController)

app.get('/posts', getPostsController)
app.get('/tags/:tag', getPostsByFilterController)
app.get('/posts/:id', getOnePostController)
app.post('/posts/views/:id', addViewsController)
app.post('/posts', authMiddleware, createPostController)
app.patch('/posts/:id', authMiddleware, updatePostController)
app.delete('/posts/:id', authMiddleware, deletePostController)
app.patch('/posts/likes/:id', authMiddleware, addLikeController)
app.delete('/posts/likes/:id', authMiddleware, removeLikeController)

// Server
app.listen(PORT, (error) => {
  if (error) {
    console.log(error)
  }
  console.log(`Server start at port: ${PORT}`)
})
