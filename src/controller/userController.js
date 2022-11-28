const { successCode, failCode, errorCode, emailError } = require('../utils/response');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const sequelize = require('../model/modelConnectDb');
const initModel = require('../model/init-models');
const { encodeToken, decodeToken } = require('../middleware/auth');

const model = initModel(sequelize);
let signUpAccountList = [];

// GET
const getUserType = async (req, res) => {
  try {
    let result = await model.NguoiDung.findAll({ attributes: ["loai_nguoi_dung"] });
    let typeList = result.map(item => item.dataValues);
    let uniqueTypeList = [...new Map(typeList.map(item => [item['loai_nguoi_dung'], item])).values()]
    successCode(res, uniqueTypeList)
  } catch (error) {
    console.log(error)
    errorCode(res);
  }
}

const getUserList = async (req, res) => {
  try {
    let userList = await model.NguoiDung.findAll();
    successCode(res, userList);
  } catch (error) {
    console.log(error)
    errorCode(res)
  }
}

const getUserListPagination = async (req, res) => {
  try {
    let { currentPageId, pageSize } = req.body;
    let result = await model.NguoiDung.findAll({ offset: currentPageId * pageSize - pageSize, limit: pageSize })
    res.send({
      statusCode: 200,
      message: "Xử lý thành công!",
      currentPageId,
      pageSize,
      content: result
    })
  } catch (error) {
    console.log(error)
    errorCode(res)
  }
}

const getUserById = async (req, res) => {
  try {
    let { id } = req.params;
    let checkUser = await model.NguoiDung.findByPk(id);
    if (checkUser) {
      successCode(res, checkUser)
    } else {
      failCode(res, checkUser, "Tài khoản không tồn tại!")
    }
  } catch (error) {
    console.log(error)
    errorCode(res)
  }
}


// POST
const logIn = async (req, res) => {
  try {
    let { email, mat_khau } = req.body;
    let checkUser = signUpAccountList.find(item => item.email === email)
    if (checkUser) {
      if (mat_khau === checkUser.mat_khau) {
        let token = encodeToken(checkUser)
        successCode(res, { ...checkUser, "accessToken": token })
      } else {
        failCode(res, "", "Mật khẩu không đúng!")
      }
    } else {
      failCode(res, checkUser, "Email chưa được đăng ký!")
    }
  } catch (error) {
    console.log(error)
    emailError(res, error)
  }
}

const signUp = async (req, res) => {
  try {
    let { ho_ten, email, so_dt, mat_khau } = req.body;
    let checkEmail = signUpAccountList.find(item => item.email === email)
    if (checkEmail) failCode(res, "", "Email đã được đăng ký!")
    else {
      let formSignUp = {
        tai_khoan: 0,
        ho_ten,
        email,
        so_dt,
        mat_khau,
        loai_nguoi_dung: "KhachHang"
      }
      signUpAccountList.push(formSignUp)
      console.log(signUpAccountList)
      res.status(200).json({
        statusCode: '200',
        message: 'Đăng ký thành công!',
        content: formSignUp,
      })
    }
  } catch (error) {
    console.log(error)
    emailError(res, error)
  }
}

const getAccountInfo = async (req, res) => {
  try {
    let bearerToken = req.headers.authorization;
    let auth = bearerToken.replace("Bearer ", "");
    let { data } = decodeToken(auth);
    let { tai_khoan } = data;
    let nguoiDungDatVe = await model.NguoiDung.findAll({
      include: "DatVes"
    });
    let index = nguoiDungDatVe.findIndex(item => item.tai_khoan === tai_khoan)
    successCode(res, nguoiDungDatVe[index])
  } catch (error) {
    console.log(error)
    errorCode(res)
  }
}

const getUserInfo = async (req, res) => {
  try {
    let bearerToken = req.headers.authorization;
    let auth = bearerToken.replace("Bearer ", "");
    let { data } = decodeToken(auth);
    let { tai_khoan } = data;
    let datve = await model.NguoiDung.findAll({
      include: [{
        model: model.DatVe,
        as: "DatVes",
        include: [
          {
            model: model.LichChieu,
            as: "ma_lich_chieu_LichChieu",
            include: [
              {
                model: model.Phim,
                as: "ma_phim_Phim"
              },
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
          },
          {
            model: model.Ghe,
            as: "Ghes"
          }
        ]
      }]
    });
    let index = datve.findIndex(item => item.tai_khoan === tai_khoan)
    successCode(res, datve[index])
  } catch (error) {
    console.log(error)
    errorCode(res)
  }
}

// do admin quản lý ở phần admin của trang, còn api này là nhằm để client dùng ở phần client của trang
const addUser = async (req, res) => {
  try {
    let bearerToken = req.headers.authorization;
    let auth = bearerToken.replace("Bearer ", "");
    let { data } = decodeToken(auth);
    let { ho_ten, email, so_dt, mat_khau, loai_nguoi_dung } = req.body
    let user = {
      tai_khoan: 0,
      ho_ten,
      email,
      so_dt,
      mat_khau,
      loai_nguoi_dung,
    }
    let checkDataInput = _.isEqual(data, user);
    if (checkDataInput) {
      let checkUser = await model.NguoiDung.findAll({
        where: {
          email,
          so_dt,
        },
      })
      if (checkUser[0]) {
        failCode(res, "", "Người dùng đã tồn tại!")
        return;
      } else {
        let result = await model.NguoiDung.create(user);
        console.log(result)
        let userTokenInDatabase = encodeToken(result)
        successCode(res, { ...result.dataValues, userTokenInDatabase })
      }
    } else {
      failCode(res, checkDataInput, "Sai thông tin đăng nhập!")
    }
  } catch (error) {
    console.log(error)
    errorCode(res)
  }
}

// PUT, token bearer lấy từ addUser để xác định tài khoản nào cần update trong db
const updateUserInfo = async (req, res) => {
  try {
    let bearerToken = req.headers.authorization;
    let auth = bearerToken.replace("Bearer ", "");
    let { data } = decodeToken(auth);
    console.log("xacthucbearer", data);
    let { tai_khoan } = data;
    console.log(tai_khoan);

    let { ho_ten, email, so_dt, mat_khau, loai_nguoi_dung } = req.body
    let userUpdate = {
      tai_khoan,
      ho_ten,
      email,
      so_dt,
      mat_khau,
      loai_nguoi_dung,
    }
    console.log("userUpdate", userUpdate);

    let checkEmailUser = await model.NguoiDung.findAll({
      where: {
        email,
      },
    })
    
    console.log("checkEmailUser", checkEmailUser[0])
  
    if (checkEmailUser[0]) {
      failCode(res, "", `Email đã bị trùng!`)
    } else {
      let checkSDTUser = await model.NguoiDung.findAll({
        where: {
          so_dt,
        },
      })
      console.log("checkSDTUser", checkSDTUser[0])
      if (checkSDTUser[0]) {
        failCode(res, "", `SDT đã bị trùng!`)
      } else {
          let result = await model.NguoiDung.update(userUpdate, {where: {tai_khoan}})
          successCode(res, userUpdate)
      }
    }
  } catch (error) {
    console.log(error)
    errorCode(res)
  }
}

// admin moi xoa duoc nguoi dung
// DELETE
const deleteUser = async (req, res) => {
  try {
    // let id = 
    res.send("deleter user")
  } catch (error) {
    console.log(error)
    errorCode(res)
  }
}

module.exports = {
  getUserType,
  getUserList,
  getUserListPagination,
  getUserById,
  logIn,
  signUp,
  getAccountInfo,
  getUserInfo,
  addUser,
  updateUserInfo,
  deleteUser
}
