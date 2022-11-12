const express = require('express');
const movieRoute = express.Router();

const {
  getBannerList,
  getMovieList,
  getMovieListPagination,
  getMovieListDate,
  getMovie,
  addMovie,
  updateMovie,
  uploadMovieImage,
  deleteMovie
} = require('../controller/movieController')

// GET
movieRoute.use("/LayDanhSachBanner", getBannerList)
movieRoute.use("/LayDanhSachPhim", getMovieList)
movieRoute.use("/LayDanhSachPhimPhanTrang", getMovieListPagination)
movieRoute.use("/LayDanhSachPhimTheoNgay", getMovieListDate)
movieRoute.use("/LayThongTinPhim", getMovie)

// POST
movieRoute.post("/ThemPhimUploadHinh", addMovie)
movieRoute.post("/CapNhatPhimUpload", updateMovie)
movieRoute.post("", uploadMovieImage)

// DELETE
movieRoute.delete("/XoaPhim", deleteMovie)

module.exports = movieRoute;
