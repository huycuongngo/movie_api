const express = require('express');
const ticketRoute = express.Router();
const { getTicketList, purchaseTicket, createMovieSchedule } = require('../controller/ticketController')
const { checkTokenInAPI } = require('../middleware/auth')

// GET
ticketRoute.get("/LayDanhSachPhongVe/:id", getTicketList)

// POST
ticketRoute.post("/DatVe", checkTokenInAPI, purchaseTicket)
ticketRoute.post("/TaoLichChieu", checkTokenInAPI, createMovieSchedule)

module.exports = ticketRoute;
