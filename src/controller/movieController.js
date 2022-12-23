const { successCode, failCode, errorCode } = require('../utils/response');
const _ = require('lodash');
const sequelize = require('../model/modelConnectDb');
const initModel = require('../model/init-models');
const { validateDate, convertDate } = require('../utils/validate');
const { paginate } = require('../utils/involveObject');
const fs = require('fs')

const model = initModel(sequelize);

// GET
const getBannerList = async (req, res) => {
  try {
    let bannerList = await model.Banner.findAll();
    successCode(res, bannerList);
  } catch (error) {
    console.log(error);
    errorCode(res)
  }
}

const getMovieList = async (req, res) => {
  try {
    let movieList = await model.Phim.findAll()
    successCode(res, movieList)
  } catch (error) {
    console.log(error)
    errorCode(res)
  }
}

const getMovieListPagination = async (req, res) => {
  try {
    let { currentPageId, pageSize } = req.body;
    let movieList = await model.Phim.findAll()
    let totalCount = movieList.length
    let totalPages = Math.ceil(totalCount / pageSize)
    let result = await model.Phim.findAll({ offset: currentPageId * pageSize - pageSize, limit: pageSize })
    let count = result.length
    successCode(res, { currentPageId, count, totalPages, totalCount, result })
  } catch (error) {
    console.log(error)
    errorCode(res)
  }
}

const getMovieListDate = async (req, res) => {
  try {
    let { currentPageId, pageSize, startDate, endDate } = req.body;
    let checkDate = validateDate(startDate) && validateDate(endDate);
    if (checkDate) {
      let movieList = await model.Phim.findAll()
      let startDateConveted = convertDate(startDate)
      let endDateConveted = convertDate(endDate)
      let movieListFound = movieList.filter(movie =>
        movie.dataValues.ngay_khoi_chieu >= startDateConveted && movie.dataValues.ngay_khoi_chieu <= endDateConveted
      )
      let totalCount = movieListFound.length
      let totalPages = Math.ceil(totalCount / pageSize)
      let movieListPaginate = paginate(movieListFound, pageSize, currentPageId);
      let count = movieListPaginate.length;
      successCode(res, { currentPageId, count, totalPages, totalCount, movieListPaginate })
    } else {
      failCode(res, "", "Ngày không hợp lệ! Nhập ngày định dạng DD/MM/YYYY")
    }
  } catch (error) {
    console.log(error)
    errorCode(res)
  }
}

const getMovie = async (req, res) => {
  try {
    let { maPhim } = req.params;
    let checkMovie = await model.Phim.findByPk(maPhim)
    if (checkMovie) {
      successCode(res, checkMovie)
    } else {
      failCode(res, "", "Mã phim không tồn tại!")
    }
  } catch (error) {
    console.log(error)
    errorCode(res)
  }
}

// POST
//kiem tra dinh dang file image
//kiem tra ten phim co bi trung
//kiem tra dinh dang ngay
const addMovie = async (req, res) => {
  try {
    let { ten_phim, mo_ta, ngay_khoi_chieu, danh_gia, hot, dang_chieu, sap_chieu } = req.body
    let filmName = ten_phim.trim()
    let checkTenPhim = await model.Phim.findAll({
      where: {
        ten_phim: filmName
      }
    })
    let checkImage = (req.file?.mimetype === 'image/png' || req.file?.mimetype === 'image/jpg' || req.file?.mimetype === 'image/gif')
    let checkVideo = req.file?.mimetype === 'video/mp4'
    let checkDate = validateDate(ngay_khoi_chieu)

    if (!checkImage) {
      failCode(res, "", "Hình ảnh định dạng *.jpg, *.png, *.gif !")
      if (checkVideo) {
        fs.unlink(req.file?.path, (err) => {
          if (err) console.error(err)
        })
      }
    } else {
      if (checkTenPhim[0]) {
        failCode(res, "", "Tên phim đã tồn tại!")
        fs.unlink(req.file?.path, (err) => {
          if (err) console.error(err)
        })
      } else {
        if (!checkDate) {
          failCode(res, "", "Ngày không hợp lệ! Nhập ngày định dạng DD/MM/YYYY")
          fs.unlink(req.file?.path, (err) => {
            if (err) console.error(err)
          })
        } else {
          let image = req.file
          let dateConverted = convertDate(ngay_khoi_chieu);
          await fs.readFile(image.path, async (err, data) => {
            let fileImageBase64 = `data:${image.mimetype};base64,` + Buffer.from(data).toString("base64")
            let newMovie = {
              ma_phim: 0,
              ten_phim,
              trailer: null,
              hinh_anh: fileImageBase64,
              mo_ta,
              ngay_khoi_chieu: dateConverted,
              danh_gia,
              hot,
              dang_chieu,
              sap_chieu
            }
            let result = await model.Phim.create(newMovie);
            successCode(res, result)
          })
          fs.unlink(image.path, (err) => {
            if (err) console.error(err)
          })
        }
      }
    }
  } catch (error) {
    errorCode(res, error)
  }
}

// PUT
//kiem tra dinh dang file image
//kiem tra ma phim ton tai
//kiem tra ten phim co bi trung
//kiem tra dinh dang ngay
const updateMovie = async (req, res) => {
  try {
    let { ma_phim } = req.params;
    let { ten_phim, mo_ta, ngay_khoi_chieu, danh_gia, hot, dang_chieu, sap_chieu } = req.body
    let filmName = ten_phim.trim()
    let checkMovie = await model.Phim.findByPk(ma_phim)
    let checkTenPhim = await model.Phim.findAll({
      where: {
        ten_phim: filmName
      }
    })
    let checkTenPhimItself = await model.Phim.findAll({
      where: {
        ma_phim,
        ten_phim: filmName
      }
    })
    let checkImage = (req.file?.mimetype === 'image/png' || req.file?.mimetype === 'image/jpg' || req.file?.mimetype === 'image/gif')
    let checkVideo = req.file?.mimetype === 'video/mp4'
    let checkDate = validateDate(ngay_khoi_chieu)

    if (!checkImage) {
      failCode(res, "", "Hình ảnh định dạng *.jpg, *.png, *.gif !")
      if (checkVideo) {
        fs.unlink(req.file?.path, (err) => {
          if (err) console.error(err)
        })
      }
    } else {
      if (!checkMovie) {
        failCode(res, "", "Mã phim không tồn tại!")
        fs.unlink(req.file?.path, (err) => {
          if (err) console.error(err)
        })
      } else {
        if (!checkTenPhimItself[0] && checkTenPhim[0]) {
          failCode(res, "", "Tên phim đã tồn tại!")
          fs.unlink(req.file?.path, (err) => {
            if (err) console.error(err)
          })
        } else {
          if (!checkDate) {
            failCode(res, "", "Ngày không hợp lệ! Nhập ngày định dạng DD/MM/YYYY")
            fs.unlink(req.file?.path, (err) => {
              if (err) console.error(err)
            })
          } else {
            let image = req.file
            let dateConverted = convertDate(ngay_khoi_chieu);
            await fs.readFile(image.path, async (err, data) => {
              let fileImageBase64 = `data:${image.mimetype};base64,` + Buffer.from(data).toString("base64")
              let movieUpdate = {
                ma_phim,
                ten_phim,
                trailer: null,
                hinh_anh: fileImageBase64,
                mo_ta,
                ngay_khoi_chieu: dateConverted,
                danh_gia,
                hot,
                dang_chieu,
                sap_chieu
              }
              await model.Phim.update(movieUpdate, {
                where: {
                  ma_phim
                }
              });
              let result = await model.Phim.findByPk(ma_phim)
              successCode(res, result)
            })
            fs.unlink(image.path, (err) => {
              if (err) console.error(err)
            })
          }
        }
      }
    }
  } catch (error) {
    errorCode(res, error)
  }
}


//kiem tra dinh dang file video
//kiem tra ma phim ton tai
const updateMovieVideo = async (req, res) => {
  try {
    let { ma_phim } = req.params
    let checkMaPhim = await model.Phim.findByPk(ma_phim)

    let checkImage = (req.file?.mimetype === 'image/png' || req.file?.mimetype === 'image/jpg' || req.file?.mimetype === 'image/gif')
    let checkVideo = req.file?.mimetype === 'video/mp4';

    if (!checkVideo) {
      failCode(res, "", "Video định dạng *.mp4 !")
      if (checkImage) {
        fs.unlink(req.file?.path, (err) => {
          if (err) console.error(err)
        })
      }
    } else {
      if (!checkMaPhim) {
        failCode(res, "", "Mã phim không tồn tại!")
        fs.unlink(req.file?.path, (err) => {
          if (err) console.error(err)
        })
      } else {
        let video = req.file
        await fs.readFile(video.path, async (err, data) => {
          let fileVideoBase64 = `data:${video.mimetype};base64,` + Buffer.from(data).toString("base64")
          await model.Phim.update(
            {
              trailer: fileVideoBase64
            },
            {
              where: { ma_phim }
            }
          )
          successCode(res, fileVideoBase64)
        })
        fs.unlink(video.path, (err) => {
          if (err) console.error(err)
        })
      }
    }
  } catch (error) {
    errorCode(res, error)
  }
}

// DELETE
const deleteMovie = async (req, res) => {
  try {
    let { ma_phim } = req.params
    let checkMovie = await model.Phim.findByPk(ma_phim)
    if (checkMovie) {
      let result = await model.Phim.destroy({
        where: {
          ma_phim
        }
      })
      successCode(res, result)
    } else {
      failCode(res, "", "Mã phim không tồn tại!")
    }
  } catch (error) {
    errorCode(res, error)
  }
}

module.exports = {
  getBannerList,
  getMovieList,
  getMovieListPagination,
  getMovieListDate,
  getMovie,

  addMovie,

  updateMovie,
  updateMovieVideo,

  deleteMovie,
}
