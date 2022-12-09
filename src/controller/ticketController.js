const { successCode, failCode, errorCode } = require('../utils/response')
const { Op } = require("sequelize");
const sequelize = require('../model/modelConnectDb');
const initModel = require('../model/init-models');
const { decodeToken } = require('../middleware/auth');
const { validateDate, convertDate, validateHour } = require('../utils/validate')

const model = initModel(sequelize);

// GET
const getTicketList = async (req, res) => {
  try {
    let { id } = req.params;
    let checkMaLichChieu = await model.LichChieu.findByPk(id)
    if (checkMaLichChieu) {
      let result = await model.Phim.findAll({
        include: [{
          model: model.LichChieu,
          as: "LichChieus",
          where: {
            ma_lich_chieu: id
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
    let { tai_khoan, ma_lich_chieu, danh_sach_ghe } = req.body

    // loại bỏ các mã ghế trùng lặp khi người dùng cố ý nhập
    var danhSachGheUnique = [...new Set(danh_sach_ghe)];

    let checTaiKhoan = await model.NguoiDung.findByPk(tai_khoan)
    let checkLichChieu = await model.LichChieu.findByPk(ma_lich_chieu)

    if (!checTaiKhoan) {
      failCode(res, "", "Tài khoản không tồn tại!")
    } else if (!checkLichChieu) {
      failCode(res, "", "Lịch chiếu không tồn tại")
    }  else {
      let maRap = checkLichChieu.ma_rap

      // lấy KHOẢN mã ghế của rạp
      let khoanMaGhe = await model.Ghe.findAll({
        where: {
          ma_rap: maRap,
        }
      })

      let maGheDau = khoanMaGhe[0].dataValues.ma_ghe
      let maGheCuoi = khoanMaGhe[khoanMaGhe.length - 1].dataValues.ma_ghe

      // liệt kê những ghế thuộc KHOẢN mã ghế của rạp từ danh sách ghế người dùng nhập vào
      let checkMaGheTrongRap = await model.Ghe.findAll({
        where: {
          ma_rap: maRap,
          ma_ghe: {
            [Op.or]: danhSachGheUnique
          }
        }
      })

      //nếu có ít nhất 1 ghế KHÔNG thuộc
      if (checkMaGheTrongRap.length !== danhSachGheUnique.length) {
        failCode(res, "", `Mã lịch chiếu ${ma_lich_chieu} tương ứng với Rạp ${maRap}, có mã ghế từ ${maGheDau} đến ${maGheCuoi}`)
      }

      // nếu tất cả ghế đều thuộc
      else {
        let purchasedTicketList = [];     
        checkMaGheTrongRap.forEach(ghe => {

          // nếu ghế nào có "mã vé" khác null, chứng tỏ ghế đó đã được đặt trước
          if (ghe.dataValues.ma_ve !== null) {
            purchasedTicketList.push(ghe.dataValues.ma_ghe)
          }
        })
        if (purchasedTicketList.length !== 0) {
          failCode(res, "", `Ghế ${purchasedTicketList} đã có người đặt trước!`)
        } else {
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
          let lastTicketID = newTicket[newTicket.length - 1]?.dataValues.ma_ve
          for (let i = 0; i < danhSachGheUnique.length; ++i) {
            await model.Ghe.update(
              { ma_ve: lastTicketID },
              {
                where: {
                  ma_ghe: danhSachGheUnique[i]
                }
              }
            )
          }

          let result = await model.DatVe.findAll({
            where: {
              ma_ve: lastTicketID
            },
            include: [
              {
                model: model.NguoiDung,
                as: "tai_khoan_NguoiDung"
              },
              {
                model: model.LichChieu,
                as: "ma_lich_chieu_LichChieu"
              },
              {
                model: model.Ghe,
                as: "Ghes"
              }
            ]
          })
          successCode(res, result)
        }
      }
    }
  } catch (error) {
    errorCode(res, error)
  }
}

const createMovieSchedule = async (req, res) => {
  try {
    let { ma_rap, ma_phim, ngay_chieu, gio_chieu, gia_ve } = req.body
    let checkMaRap = await model.RapPhim.findByPk(ma_rap)
    let checkMaPhim = await model.Phim.findByPk(ma_phim)
    let checkDate = validateDate(ngay_chieu);
    let checkHour = validateHour(gio_chieu)

    if (!checkMaRap) {
      failCode(res, "", "Mã rạp không tồn tại!")
    } else if (!checkMaPhim) {
      failCode(res, "", "Mã phim không tồn tại!")
    } else if (!checkDate) {
      failCode(res, "", "Ngày không hợp lệ. Ngày chiếu đinh dạng DD/MM/YYYY !")
    } else if (!checkHour) {
      failCode(res, "", "Giờ chiếu định dạng hh:mm:ss !")
    } else {
      let dateConverted = convertDate(ngay_chieu)
      let ngay_gio_chieu = `${dateConverted}T${gio_chieu}.000Z`;
      let checkDateTimeDuplicate = await model.LichChieu.findAll({
        where: {
          ma_rap,
          ma_phim,
          ngay_gio_chieu,
        },
      })
      if (checkDateTimeDuplicate[0]) {
        failCode(res, "", "Ngày giờ chiếu đã bị trùng!")
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
    errorCode(res, error)
  }
}

module.exports = {
  getTicketList,
  purchaseTicket,
  createMovieSchedule
}
