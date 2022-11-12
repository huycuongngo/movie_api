const { successCode, failCode, errorCode } = require('../utils/response')

// GET
const getBannerList = async (req, res) => {
  res.send("13ok")
}
const getMovieList = async (req, res) => {

}
const getMovieListPagination = async (req, res) => {

}
const getMovieListDate = async (req, res) => {

}
const getMovie = async (req, res) => {

}

// POST
const addMovie = async (req, res) => {

}

const updateMovie = async (req, res) => {

}

const uploadMovieImage = async (req, res) => {

}

// DELETE
const deleteMovie = async (req, res) => {

}

module.exports = {
  getBannerList,
  getMovieList,
  getMovieListPagination,
  getMovieListDate,
  getMovie,
  addMovie,
  updateMovie,
  uploadMovieImage,
  deleteMovie
}