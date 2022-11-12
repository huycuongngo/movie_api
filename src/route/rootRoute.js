const express = require('express');

const ticketRoute = require("./ticketRoute")
const userRoute = require("./userRoute")
const movieRoute = require("./movieRoute")
const cinemaRoute = require("./cinemaRoute")

const rootRoute = express.Router();

rootRoute.use("/QuanLyDatVe", ticketRoute)
rootRoute.use("/QuanLyNguoiDung", userRoute)
rootRoute.use("/QuanLyPhim", movieRoute)
rootRoute.use("/QuanLyRap", cinemaRoute)

module.exports = rootRoute;
