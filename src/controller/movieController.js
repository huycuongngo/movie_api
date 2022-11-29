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


    res.send("oki getmovie")
  } catch (error) {

  }
}

// POST
const addMovieWithImage = async (req, res) => {
  try {

  } catch (error) {

  }
}

const updateMovieWithImage = async (req, res) => {
  try {

  } catch (error) {

  }
}

const updateMovieWithVideo = async (req, res) => {
  try {

  } catch (error) {

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

  updateMovieWithImage,
  updateMovieWithVideo,

  deleteMovie,
}
