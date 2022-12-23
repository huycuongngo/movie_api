const { successCode, failCode, errorCode, emailError } = require('../utils/response');
const _ = require('lodash');
const sequelize = require('../model/modelConnectDb');
const initModel = require('../model/init-models');
const { encodeToken, decodeToken } = require('../middleware/auth');
const { validateEmail } = require('../utils/validate')
const { paginate } = require('../utils/involveObject')
const { Op } = require('sequelize')

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
    errorCode(res), error;
  }
}

const getUserList = async (req, res) => {
  try {
    let userList = await model.NguoiDung.findAll();
    successCode(res, userList);
  } catch (error) {
    errorCode(res, error)
  }
}

const getUserListPagination = async (req, res) => {
  try {
    let { currentPageId, pageSize } = req.body;
    let userList = await model.NguoiDung.findAll()
    let totalCount = userList.length
    let totalPages = Math.ceil(totalCount / pageSize)
    let result = await model.NguoiDung.findAll({ offset: currentPageId * pageSize - pageSize, limit: pageSize })
    let count = result.length
    successCode(res, { currentPageId, count, totalPages, totalCount, result });
  } catch (error) {
    errorCode(res, error)
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
    errorCode(res, error)
  }
}

const searchUserPagination = async (req, res) => {
  try {
    let { keyWord, currentPageId, pageSize } = req.body
    let userList = await model.NguoiDung.findAll({
      where: {
        ho_ten: {
          [Op.like]: `%${keyWord}%`
        }
      }
    })
    if (userList[0]) {
      let totalCount = userList.length
      let totalPages = Math.ceil(totalCount / pageSize)
      let result = paginate(userList, pageSize, currentPageId)
      let count = result.length
      successCode(res, { currentPageId, count, totalPages, totalCount, result });
    } else {
      failCode(res, "", `Không tồn tại người dùng có họ tên chứa ký tự ${keyWord} `)
    }
  } catch (error) {
    errorCode(res, error)
  }
}


// POST
const logIn = async (req, res) => {
  try {
    let { email, mat_khau } = req.body;
    let checkUserInDb = await model.NguoiDung.findAll({
      where: {
        email,
        mat_khau
      }
    })
    let checkEmailInDb = await model.NguoiDung.findAll({
      where: {
        email
      }
    })
    let checkEmail = signUpAccountList.find(item => item.email === email)
    if (!validateEmail(email)) {
      failCode(res, "", "Email không hợp lệ")
    } else {
      if (checkUserInDb[0]) {
        let token = encodeToken(checkUserInDb[0])
        successCode(res, { ...checkUserInDb[0].dataValues, "accessToken": token })
      } else {
        if (checkEmailInDb[0]) {
          failCode(res, "", "Email đã tồn tại!")
        } else {
          if (!checkEmail) {
            failCode(res, checkEmail, "Email chưa được đăng ký!")
          } else {
            if (checkEmail?.mat_khau !== mat_khau) {
              failCode(res, "", "Không đúng mật khẩu đăng ký!")
            } else {
              let token = encodeToken(checkEmail)
              successCode(res, { ...checkEmail, "accessToken": token })
            }
          }
        }
      }
    }
  } catch (error) {
    errorCode(res, error)
  }
}


const signUp = async (req, res) => {
  try {
    let { ho_ten, email, so_dt, mat_khau } = req.body;

    let checkEmailInDb = await model.NguoiDung.findAll({
      where: {
        email
      }
    })

    let checkPhoneInDb = await model.NguoiDung.findAll({
      where: {
        so_dt,
      }
    })
    if (!validateEmail(email)) {
      failCode(res, "", "Email không hợp lệ!")
    } else {
      if (checkEmailInDb[0]) {
        failCode(res, "", "Email đã tồn tại!")
      } else {
        if (checkPhoneInDb[0]) {
          failCode(res, "", "Số điện thoại đã tồn tại!")
        } else {
          let checkEmail = signUpAccountList.find(item => item.email === email)
          let checkPhone = signUpAccountList.find(item => item.so_dt === so_dt)
          if (!checkEmail && !checkPhone) {
            let formSignUp = {
              ho_ten,
              email,
              so_dt,
              mat_khau,
              loai_nguoi_dung: "KhachHang"
            }
            signUpAccountList.push(formSignUp)
            successCode(res, signUpAccountList)
          } else if (!checkEmail && checkPhone) {                          //thay đổi email, và giữ nguyên sdt
            failCode(res, signUpAccountList, "Số điện thoại vừa được đăng ký!")
          } else if (checkEmail && !checkPhone) {                          //giữ nguyên email, và thay đổi sdt
            failCode(res, signUpAccountList, "Email vừa được đăng ký!")
          } else {
            failCode(res, signUpAccountList, "Email và số điện thoại vừa được đăng ký!")
          }
        }
      }
    } 
  } catch (error) {
    errorCode(res, error)
  }
}

const getAccountInfo = async (req, res) => {
  try {
    let bearerToken = req.headers.authorization;
    let auth = bearerToken.replace("Bearer ", "");
    let { data } = decodeToken(auth);
    successCode(res, data)
  } catch (error) {
    errorCode(res, error)
  }
}

const getUserInfo = async (req, res) => {
  try {
    let { id } = req.params;
    let checkUser = await model.NguoiDung.findByPk(id)
    if (checkUser) {
      let user = await model.NguoiDung.findAll({
        where: {
          tai_khoan: id
        },
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
      successCode(res, user)
    } else {
      failCode(res, "", "User không tồn tại!")
    }
  } catch (error) {
    errorCode(res, error)
  }
}

const addUser = async (req, res) => {
  try {
    let { ho_ten, email, so_dt, mat_khau } = req.body

    let checkEmail = signUpAccountList.find(item => item.email === email)
    let checkUserSignUpIndex = signUpAccountList.findIndex(item => item.email === email)

    let checkEmailInDb = await model.NguoiDung.findAll({
      where: {
        email
      }
    })
    let checkPhoneInDb = await model.NguoiDung.findAll({
      where: {
        so_dt,
      }
    })
    if (!validateEmail(email)) {
      failCode(res, "", "Email không hợp lệ")
    } else {
      if (checkEmailInDb[0]) {
        failCode(res, "", "Email đã tồn tại!")
      } else {
        if (checkPhoneInDb[0]) {
          failCode(res, "", "Số điện thoại đã tồn tại!")
        } else {
          if (!checkEmail) {
            failCode(res, "", "Sai email đăng ký!")
          } else if (checkEmail.ho_ten !== ho_ten) {
            failCode(res, "", "Sai họ tên đăng ký!")
          } else if (checkEmail.so_dt !== so_dt) {
            failCode(res, "", "Sai số điện thoại đăng ký!")
          } else if (checkEmail.mat_khau !== mat_khau) {
            failCode(res, "", "Sai mật khẩu đăng ký!")
          } else {
            let newUser = {
              tai_khoan: 0,
              ho_ten,
              email,
              so_dt,
              mat_khau,
              loai_nguoi_dung: "KhachHang",
            }
            let result = await model.NguoiDung.create(newUser);
            successCode(res, result)
            signUpAccountList.splice(checkUserSignUpIndex, 1)
          }
        }
      }
    }
  } catch (error) {
    errorCode(res, error)
  }
}


// PUT
const updateUserInfo = async (req, res) => {
  try {
    let { id } = req.params
    let { ho_ten, email, so_dt, mat_khau } = req.body
    let checkUser = await model.NguoiDung.findByPk(id)

    // giữ nguyên email và so_dt của chính nó, chi thay doi ho_ten va mat_khau
    let checkEmailAndPhone = await model.NguoiDung.findAll({
      where: {
        tai_khoan: id,
        email,
        so_dt
      }
    })

    // nếu thay đổi email và giữ nguyên so_dt thì kiểm tra email này có trùng trong db và trùng đăng ký
    // nếu email ko trùng db hoặc trùng đăng ký thì cho cập nhật
    let checkEmailInDbItself = await model.NguoiDung.findAll({
      where: {
        tai_khoan: id,
        email
      }
    })

    let checkEmailInDb = await model.NguoiDung.findAll({
      where: {
        email,
      }
    })

    // nếu giữ nguyên email và thay đổi so_dt thì kiểm tra so_dt này có trùng trong db và trùng đăng ký
    // nếu so_dt không trùng db hoặc trùng đăng ký thì cho cập nhật
    let checkPhoneInDbItSelf = await model.NguoiDung.findAll({
      where: {
        tai_khoan: id,
        so_dt
      }
    })

    let checkPhoneInDb = await model.NguoiDung.findAll({
      where: {
        so_dt
      }
    })

    let checkEmail = signUpAccountList.find(item => item.email === email)
    let checkPhone = signUpAccountList.find(item => item.so_dt === so_dt)

    if (!checkUser) {
      failCode(res, "", "User không tồn tại!")
    } else if (!validateEmail(email)) {
      failCode(res, "", "Email không hợp lệ")
    } else if (checkEmailAndPhone[0]) {
      await model.NguoiDung.update(
        {
          ho_ten,
          email,
          so_dt,
          mat_khau
        },
        { where: { tai_khoan: id } })
      let userUpdate = await model.NguoiDung.findByPk(id)
      successCode(res, userUpdate)
    } else if (!checkEmailInDbItself[0] && checkEmailInDb[0]) {
      failCode(res, "", "Email đã tồn tại!")
    } else if (checkEmail) {
      failCode(res, "", "Email đã được đăng ký!")
    } else if (!checkEmailInDb[0] && !checkEmail && checkPhoneInDbItSelf[0]) { 
      await model.NguoiDung.update(
        {
          ho_ten,
          email,
          so_dt,
          mat_khau
        },
        { where: { tai_khoan: id } })
      let userUpdate = await model.NguoiDung.findByPk(id)
      successCode(res, userUpdate)
    } else if (!checkPhoneInDbItSelf[0] && checkPhoneInDb[0]) {
      failCode(res, "", "Số điện thoại đã tồn tại!")
    } else if (checkPhone) {
      failCode(res, "", `Số điện thoại đã được đăng ký!`)
    } else {
      await model.NguoiDung.update(
        {
          ho_ten,
          email,
          so_dt,
          mat_khau
        },
        { where: { tai_khoan: id } })
      let userUpdate = await model.NguoiDung.findByPk(id)
      successCode(res, userUpdate)
    }
  } catch (error) {
    errorCode(res, error)
  }
}

// DELETE
const deleteUser = async (req, res) => {
  try {
    let { id } = req.params
    let checkUser = await model.NguoiDung.findByPk(id)
    if (checkUser) {
      let result = await model.NguoiDung.destroy(
        {
          where: {
            tai_khoan: id
          },
        }
      )
      successCode(res, result)
    } else {
      failCode(res, "", "Xóa thất bại! Người dùng không tồn tại")
    }

  } catch (error) {
    errorCode(res, error)
  }
}

module.exports = {
  getUserType,
  getUserList,
  getUserListPagination,
  getUserById,
  searchUserPagination,

  logIn,
  signUp,
  getAccountInfo,
  getUserInfo,
  addUser,

  updateUserInfo,

  deleteUser
}
