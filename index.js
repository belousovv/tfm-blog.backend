import cors from 'cors'
import express from 'express'
import multer from 'multer'
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
  createPostController,
  deletePostController,
  getOnePostController,
  getPostsController,
  updatePostController,
} from './controllers/posts-controllers.js'

const PORT = 4444
const app = express()

// Multer storage config
const storageConfig = multer.diskStorage({
  destination: (_, __, cb) => {
    cb('image')
  },
  filename: (_, file, cb) => {
    cb(file.originalname)
  },
})

// Express middlewares
app.use(cors())
app.use(express.json())
app.use('/images', express.static('images'))
app.use(multer({ storage: storageConfig }).single('image'))

// Routes
app.post(
  '/auth/register',
  registerValidator,
  validationMiddleware,
  registerController
)
app.post('/auth/login', loginValidator, validationMiddleware, loginController)
app.get('/auth/me', authMiddleware, getMeController)

app.get('/posts', getPostsController)
app.get('/posts/:id', getOnePostController)
app.post('/posts', authMiddleware, createPostController)
app.patch('/posts/:id', authMiddleware, updatePostController)
app.delete('/posts/:id', authMiddleware, deletePostController)

// Server
app.listen(PORT, (error) => {
  if (error) {
    console.log(error)
  }
  console.log(`Server start at port: ${PORT}`)
})
