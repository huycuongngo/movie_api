const express = require('express');
const movieRoute = express.Router();

const {
  getBannerList,
  getMovieList,
  getMovieListPagination,
  getMovieListDate,
  getMovie,

  addMovieWithImage,

  updateMovieWithImage,
  updateMovieWithVideo,

  deleteMovie,
} = require('../controller/movieController')

// GET
movieRoute.use("/LayDanhSachBanner", getBannerList)
movieRoute.use("/LayDanhSachPhim", getMovieList)
movieRoute.use("/LayDanhSachPhimPhanTrang", getMovieListPagination)
movieRoute.use("/LayDanhSachPhimTheoNgay", getMovieListDate)
movieRoute.use("/LayThongTinPhim", getMovie)

// POST
movieRoute.post("/ThemPhimUploadHinh", addMovieWithImage)

// PUT
movieRoute.put("/CapNhatPhimUploadImage", updateMovieWithImage)
movieRoute.put("/CapNhatPhimUploadVideo", updateMovieWithVideo)

// DELETE
movieRoute.delete("/XoaPhim", deleteMovie)

module.exports = movieRoute;
