const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "image")
      cb(null, './public/img')
    else
      cb(null, './public/video')
  },
  filename: (req, file, cb) => {
    const newFileName = Date.now() + '_' + file.originalname
    cb(null, newFileName)
  }
})

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "image") {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/gif'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  } else {
    if (file.mimetype === 'video/mp4')
      cb(null, true)
    else
      cb(null, false)
  }
};

const upload = multer({ storage, fileFilter }).fields([
  { name: 'image', maxCount: 1 },
  {name: 'video', maxCount: 1},
])

module.exports = {
  upload,
};
