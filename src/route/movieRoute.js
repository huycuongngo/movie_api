const express = require('express');
const movieRoute = express.Router();
const { upload } = require('../middleware/upload')
const { checkTokenInAPI } = require('../middleware/auth')

const {
  getBannerList,
  getMovieList,
  getMovieListPagination,
  getMovieListDate,
  getMovie,

  addMovie,

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
movieRoute.post("/ThemPhim", upload, addMovie)

// PUT
movieRoute.put("/CapNhatPhim/:ma_phim", checkTokenInAPI, upload, updateMovie)

// DELETE
movieRoute.delete("/XoaPhim/:ma_phim",checkTokenInAPI, deleteMovie)

module.exports = movieRoute;
