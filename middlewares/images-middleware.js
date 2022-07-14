import multer from 'multer'

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    console.log('dest')
    cb(null, 'uploads')
  },
  filename: (_, file, cb) => {
    console.log('file')
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
