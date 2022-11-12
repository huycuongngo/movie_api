const express = require("express");
const cinemaRoute = express.Router();
const {
  getCinemaSystem,
  getCinema,
  getCinemaSchedule,
  getSchedule
} = require("../controller/cinemaController")

// GET
cinemaRoute.use("/LayThongTinHeThongRap", getCinemaSystem)
cinemaRoute.use("/LayThongTinCumRapTheoHeThong", getCinema)
cinemaRoute.use("/LayThongTinLichChieuHeThongRap", getCinemaSchedule)
cinemaRoute.use("/LayThongTinLichChieuPhim", getSchedule)

module.exports = cinemaRoute
