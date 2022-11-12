const express = require('express');
const ticketRoute = express.Router();
const { getTicketList, purchaseTicket, createMovieSchedule } = require('../controller/ticketController')

// GET
ticketRoute.get("/LayDanhSachPhongVe", getTicketList)

// POST
ticketRoute.post("/DatVe", purchaseTicket)
ticketRoute.post("/TaoLichChieu", createMovieSchedule)

module.exports = ticketRoute;

