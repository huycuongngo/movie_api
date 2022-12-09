const { checkTokenInAPI } = require('../middleware/auth')
const express = require('express');
const userRoute = express.Router();
const {
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
} = require('../controller/userController');


// GET
userRoute.get("/LayDanhSachLoaiNguoiDung", getUserType);
userRoute.get("/LayDanhSachNguoiDung", getUserList)
userRoute.get("/LayDanhSachNguoiDungPhanTrang", getUserListPagination)
userRoute.get("/TimKiemNguoiDung/:id", getUserById)
userRoute.get("/TimKiemNguoiDungPhanTrang", searchUserPagination)

// POST
userRoute.post("/DangNhap", logIn)
userRoute.post("/DangKy", signUp)
userRoute.post("/ThongTinTaiKhoan", checkTokenInAPI, getAccountInfo)          //token admin or user
userRoute.post("/LayThongTinNguoiDung/:id", checkTokenInAPI, getUserInfo)     //token admin or user
userRoute.post("/ThemNguoiDung", checkTokenInAPI, addUser)                  //token admin

// PUT
userRoute.put("/CapNhatThongTinNguoiDung/:id", checkTokenInAPI, updateUserInfo)     //token user

// DELETE
userRoute.delete("/XoaNguoiDung/:id", checkTokenInAPI, deleteUser)       //token admin

module.exports = userRoute;


