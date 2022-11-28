const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // nơi lưu file upload trong source server
    cb(null, './public/img')
  },
  filename: (req, file, cb) => {
    const newFileName = Date.now() + '_' + file.originalname
    cb(null, newFileName)
  }
})

const upload = multer({ storage })

module.exports = upload;
