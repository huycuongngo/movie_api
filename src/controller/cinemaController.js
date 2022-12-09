const { successCode, failCode, errorCode } = require("../utils/response")
const sequelize = require('../model/modelConnectDb');
const initModel = require('../model/init-models');

const model = initModel(sequelize);

// GET
const getCinemaSystem = async (req, res) => {
  try {
    let { ma_he_thong_rap } = req.body;
    let checkMaHeThongRap = await model.HeThongRap.findByPk(ma_he_thong_rap)
    if (checkMaHeThongRap) {
      successCode(res, checkMaHeThongRap)
    } else {
      failCode(res, checkMaHeThongRap, "Mã hệ thống rạp không tồn tại!")
    }
  } catch (error) {
    errorCode(res, error)
  }
}

const getCinema = async (req, res) => {
  try {
    let { ma_he_thong_rap } = req.body;
    let checkMaHeThongRap = await model.HeThongRap.findByPk(ma_he_thong_rap)
    if (checkMaHeThongRap) {
      let cumRap = await model.HeThongRap.findAll({
        where: {
          ma_he_thong_rap,
        },
        include: "CumRaps"
      })
      successCode(res, cumRap)
    } else {
      failCode(res, checkMaHeThongRap, "Mã hệ thống rạp không tồn tại!")
    } 
  } catch (error) {
    errorCode(res, error)
  }
}

const getCinemaSchedule = async (req, res) => {
  try {
    let { ma_he_thong_rap } = req.body;
    let checkMaHeThongRap = await model.HeThongRap.findByPk(ma_he_thong_rap)
    if (checkMaHeThongRap) {
      let result = await model.HeThongRap.findAll({
        where: {
          ma_he_thong_rap,
        },
        include: [
          {
            model: model.CumRap,
            as: "CumRaps",
            include: [
              {
                model: model.RapPhim,
                as: "RapPhims",
                include: [
                  {
                    model: model.LichChieu,
                    as: "LichChieus",
                  }
                ]
              }
            ]
          }
        ]
      })
      successCode(res, result)
    } else {
      failCode(res, checkMaHeThongRap, "Mã hệ thống rạp không tồn tại!")
    } 
  } catch (error) {
    errorCode(res, error)
  }
}

const getSchedule = async (req, res) => {
  try {
    let { ma_phim } = req.body
    let checkMaPhim = await model.Phim.findByPk(ma_phim)
    if (checkMaPhim) {
      let result = await model.Phim.findAll({
        where: {
          ma_phim,
        },
        include: [
          {
            model: model.LichChieu,
            as: "LichChieus",
            include: [
              {
                model: model.RapPhim,
                as: "ma_rap_RapPhim",
                include: [
                  {
                    model: model.CumRap,
                    as: "ma_cum_rap_CumRap",
                    include: [
                      {
                        model: model.HeThongRap,
                        as: "ma_he_thong_rap_HeThongRap"
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      })
      successCode(res, result)
    } else {
      failCode(res, checkMaPhim, "Mã phim không tồn tại!")
    }
  } catch (error) {
    errorCode(res, error)
  }
}

module.exports = {
  getCinemaSystem,
  getCinema,
  getCinemaSchedule,
  getSchedule
}
