const { successCode, failCode, errorCode } = require('../utils/response');
const _ = require('lodash');
const sequelize = require('../model/modelConnectDb');
const initModel = require('../model/init-models');
const { encodeToken, decodeToken } = require('../middleware/auth');
const { validateDate, convertDate } = require('../utils/date');
const { paginate } = require('../utils/involveObject');

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
const addMovieWithImage = async (req, res) => {
  try {
    let checkImage = req.files.image;
    let checkVideo = req.files.video;
    if (checkImage && checkVideo) {
      let { ten_phim, mo_ta, ngay_khoi_chieu, danh_gia, hot, dang_chieu, sap_chieu } = req.body
      let trailer = req.files.video[0].path
      let hinh_anh = req.files.image[0].path
      let newMovie = {
        ma_phim: 0,
        ten_phim,
        trailer,
        hinh_anh,
        mo_ta,
        ngay_khoi_chieu,
        danh_gia,
        hot,
        dang_chieu,
        sap_chieu
      }
      let result = await model.Phim.create(newMovie);
      successCode(res, result)
    } else {
      failCode(res, "", "Hình ảnh *.jpg, *.png, *.gif.   Video *.mp4 !")
    }
  } catch (error) {
    console.log(error)
    errorCode(error)
  }
}

// PUT
const updateMovie = async (req, res) => {
  try {

  } catch (error) {
    console.log(error)
    errorCode(error)
  }
}

// DELETE
const deleteMovie = async (req, res) => {
  try {

  } catch (error) {

  }
}

module.exports = {
  getBannerList,
  getMovieList,
  getMovieListPagination,
  getMovieListDate,
  getMovie,

  addMovieWithImage,

  updateMovie,

  deleteMovie,
}
