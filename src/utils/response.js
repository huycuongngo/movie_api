const successCode = (res, data) => {
  res.status(200).json({
    statusCode: '200',
    message: 'Xử lý thành công!',
    content: data
  })
}

const failCode = (res, data, message) => {
  res.status(400).json({
    statusCode: '400',
    message,
    content: data
  })
}

const errorCode = (res) => {
  res.status(500).send("Server Error")
}

module.exports = {
  successCode,
  failCode,
  errorCode
}