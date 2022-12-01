const { successCode, failCode, errorCode } = require("../utils/response")
const sequelize = require('../model/modelConnectDb');
const initModel = require('../model/init-models');

const model = initModel(sequelize);

// GET
const getCinemaSystem = async (req, res) => {
  try {
    
    res.send("oki cinemaSystem")
  } catch (error) {
    console.log(error)
    errorCode(res)
  }
}

const getCinema = async (req, res) => {
  try {
    
    res.send("oki cinema")
  } catch (error) {
    console.log(error)
    errorCode(res)
  }
}

const getCinemaSchedule = async (req, res) => {
  try {
    
    res.send("getCinemaSchedule")
  } catch (error) {
    console.log(error)
    errorCode(res)
  }
}

const getSchedule = async (req, res) => {
  try {
    
    res.send("get schedule")
  } catch (error) {
    console.log(error)
    errorCode(res)
  }
}

module.exports = {
  getCinemaSystem,
  getCinema,
  getCinemaSchedule,
  getSchedule
}
