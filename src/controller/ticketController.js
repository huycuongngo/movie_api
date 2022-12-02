const { successCode, failCode, errorCode } = require('../utils/response')
const sequelize = require('../model/modelConnectDb');
const initModel = require('../model/init-models');
const { decodeToken } = require('../middleware/auth');
const { checkMaGhe } = require('../utils/checkMaGhe');
const { validateDate, convertDate, validateHour } = require('../utils/date')

const model = initModel(sequelize);

// GET
const getTicketList = async (req, res) => {
  try {
    let { ma_lich_chieu } = req.body;
    let checkMaLichChieu = await model.LichChieu.findByPk(ma_lich_chieu)
    if (checkMaLichChieu) {
      let result = await model.Phim.findAll({
        include: [{
          model: model.LichChieu,
          as: "LichChieus",
          where: {
            ma_lich_chieu
          },
          include: [{
            model: model.DatVe,
            as: "DatVes",
            include: [{
              model: model.Ghe,
              as: "Ghes"
            }]
          }]
        }]
      })
      successCode(res, result)
    } else {
      failCode(res, "", "Mã lịch chiếu không tồn tại!")
    }
  } catch (error) {
    errorCode(res, error)
  }
}

// POST
const purchaseTicket = async (req, res) => {
  try {
    let bearerToken = req.headers.authorization;
    let auth = bearerToken.replace("Bearer ", "");
    let { data } = decodeToken(auth);
    let { tai_khoan } = data;
    let { ma_lich_chieu, danh_sach_ghe } = req.body
    console.log("ma_lich_chieu", ma_lich_chieu)
    console.log("danh_sach_ghe", danh_sach_ghe)
    let checkMaLichChieu = await model.LichChieu.findByPk(ma_lich_chieu)
    if (checkMaLichChieu) {
      checkMaGhe(danh_sach_ghe, model).then(async x => {
        if (x) {
          await model.DatVe.create({
            tai_khoan,
            ma_lich_chieu,
            ma_ve: 0,
          })

          let newTicket = await model.DatVe.findAll({
            where: {
              tai_khoan,
              ma_lich_chieu,
            }
          })
          let newTicketID = newTicket[0]?.dataValues.ma_ve
          console.log("newTicket", newTicketID)

          danh_sach_ghe.forEach(async (ma_ghe) => {
            await model.Ghe.update(
              { ma_ve: newTicketID },
              {
                where: {
                  ma_ghe
                }
              }
            )
          })
          successCode(res, "")
        } else {
          failCode(res, "", "Mã ghế không hợp lệ")
        }
      })
    } else {
      failCode(res, "", "Mã lịch chiếu không tồn tại!")
    }
  } catch (error) {
    console.log(error)
    errorCode(res)
  }
}


// check mã rạp
// check mã phim
// check formate ngay_gio_chieu
// check trùng ngày giờ chiếu
const createMovieSchedule = async (req, res) => {
  try {
    let { ma_rap, ma_phim, ngay_chieu, gio_chieu, gia_ve } = req.body
    console.log({ ma_rap, ma_phim, ngay_chieu, gio_chieu, gia_ve })
    let checkMaRap = await model.RapPhim.findByPk(ma_rap)
    let checkMaPhim = await model.Phim.findByPk(ma_phim)

    let checkDate = validateDate(ngay_chieu);
    console.log(checkDate)

    let checkHour = validateHour(gio_chieu)
    console.log("checkHour", checkHour);

    // nếu như có mã rap thì hợp lệ, nếu không có thì lỗi ko tồn tại mã rạp
    if (!checkMaRap) {
      failCode(res, "", "Mã rạp không tồn tại!")
    } else if (!checkMaPhim) {
      failCode(res, "", "Mã phim không tồn tại!")
    } else if (!checkDate) {
      failCode(res, "", "Ngày chiếu đinh dạng DD/MM/YYYY !")
    } else if (!checkHour) {
      failCode(res, "", "Giờ chiếu định dạng hh:mm:ss !")
    } else {
      let dateConverted = convertDate(ngay_chieu)
      console.log("dateConverted", dateConverted);
      let ngay_gio_chieu = `${dateConverted}T${gio_chieu}.000Z`;

      let checkDateTimeDuplicate = await model.LichChieu.findAll({
        where: {
          ngay_gio_chieu,
        },
      })
      if (checkDateTimeDuplicate[0]) {
        failCode(res, "", "Ngày giờ chiếu đã tồn tại!")
      } else {
        let newMovieSchedule = await model.LichChieu.create({
          ma_rap,
          ma_phim,
          ngay_gio_chieu,
          gia_ve
        })
        successCode(res, newMovieSchedule)
      }
    }
  } catch (error) {
    console.log(error)
    errorCode(res)
  }
}

module.exports = {
  getTicketList,
  purchaseTicket,
  createMovieSchedule
}
