const express = require('express');
const movieRoute = express.Router();
const { upload } = require('../middleware/upload')

const {
  getBannerList,
  getMovieList,
  getMovieListPagination,
  getMovieListDate,
  getMovie,

  addMovieWithImage,

  updateMovie,

  deleteMovie,
} = require('../controller/movieController')

// GET
movieRoute.get("/LayDanhSachBanner", getBannerList)
movieRoute.get("/LayDanhSachPhim", getMovieList)
movieRoute.get("/LayDanhSachPhimPhanTrang", getMovieListPagination)
movieRoute.get("/LayDanhSachPhimTheoNgay", getMovieListDate)
movieRoute.get("/LayThongTinPhim/:maPhim", getMovie)

// POST
movieRoute.post("/ThemPhimUploadHinh", upload, addMovieWithImage)

// PUT
movieRoute.put("/CapNhatPhimUploadImage/:ma_phim", upload, updateMovie)

// DELETE
movieRoute.delete("/XoaPhim", deleteMovie)

module.exports = movieRoute;
