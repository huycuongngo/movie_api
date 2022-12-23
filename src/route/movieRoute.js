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
  updateMovieVideo,

  deleteMovie,
} = require('../controller/movieController')

// GET
movieRoute.get("/LayDanhSachBanner", getBannerList)
movieRoute.get("/LayDanhSachPhim", getMovieList)
movieRoute.get("/LayDanhSachPhimPhanTrang", getMovieListPagination)
movieRoute.get("/LayDanhSachPhimTheoNgay", getMovieListDate)
movieRoute.get("/LayThongTinPhim/:maPhim", getMovie)

// POST
movieRoute.post("/ThemPhim", upload.single("image"), addMovie)

// PUT
movieRoute.put("/CapNhatPhim/:ma_phim", checkTokenInAPI, upload.single("image"), updateMovie)
movieRoute.put("/CapNhatPhimUploadVideo/:ma_phim", checkTokenInAPI, upload.single("video"), updateMovieVideo)

// DELETE
movieRoute.delete("/XoaPhim/:ma_phim",checkTokenInAPI, deleteMovie)

module.exports = movieRoute;
