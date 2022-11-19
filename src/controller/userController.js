const { successCode, failCode, errorCode } = require('../utils/response')
const sequelize = require('../model/modelConnectDb');
const initModel = require('../model/init-models');

const model = initModel(sequelize);

// GET
const getUserType = async (req, res) => {
  try {
    let result = await model.NguoiDung.findAll({ attributes: ["loai_nguoi_dung"] });
    let typeList = result.map(item => item.dataValues);
    let uniqueTypeList = [...new Map(typeList.map(item => [item['loai_nguoi_dung'], item])).values()]
    successCode(res, uniqueTypeList)
  } catch (error) {
    errorCode(res);
  }
}

const getUserList = async (req, res) => {
  try {
    let userList = await model.NguoiDung.findAll();
    successCode(res, userList);
  } catch (error) {
    errorCode(res)
  }
}

const getUserListPagination = async (req, res) => {
  try {
    let { currentPageId, pageSize } = req.body;
    let result = await model.NguoiDung.findAll({ offset: currentPageId*pageSize - pageSize, limit: pageSize })
    res.send({
      statusCode: 200,
      message: "Xử lý thành công!",
      currentPageId,
      pageSize,
      content: result
    })
  } catch (error) {
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
    errorCode(res)
  }
}


// POST
const logIn = async (req, res) => {

}

const signUp = async (req, res) => {
  try {
    let { ho_ten, email, so_dt, mat_khau} = req.body;
    let formSignUp = { ho_ten, email, so_dt, mat_khau, loai_khach_hang: "KhachHang" }
    // console.log(formSignUp);
    res.send("oki")

  } catch (error) {
    errorCode(res)
  }
}

const getAccountInfo = async (req, res) => {

}

const getUserInfo = async (req, res) => {

}

const addUser = async (req, res) => {

}


// PUT
const updateUserInfo = async (req, res) => {

}


// DELETE
const deleteUser = async (req, res) => {

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
