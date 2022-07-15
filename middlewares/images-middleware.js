import multer from 'multer'
import fs from 'fs'

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads')
    }
    cb(null, 'uploads')
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname)
  },
})

const filters = ['image/png', 'image/jpg', 'image/jpeg']

const filter = (req, file, cb) => {
  console.log('filter')
  if (filters.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

export const imagesMiddleware = multer({ storage, filter })
