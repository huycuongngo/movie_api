const { checkTokenInAPI } = require('../middleware/auth')
const express = require('express');
const userRoute = express.Router();
const {
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
} = require('../controller/userController');


// GET
userRoute.get("/LayDanhSachLoaiNguoiDung", getUserType);
userRoute.get("/LayDanhSachNguoiDung", getUserList)
userRoute.get("/LayDanhSachNguoiDungPhanTrang", getUserListPagination)
userRoute.get("/TimKiemNguoiDung/:id", getUserById)

// POST
userRoute.post("/DangNhap", logIn)
userRoute.post("/DangKy", signUp)
userRoute.post("/ThongTinTaiKhoan", checkTokenInAPI, getAccountInfo)
userRoute.post("/LayThongTinNguoiDung", checkTokenInAPI, getUserInfo)
userRoute.post("/ThemNguoiDung", checkTokenInAPI, addUser)

// PUT
userRoute.put("/CapNhatThongTinNguoiDung", checkTokenInAPI, updateUserInfo)

// DELETE
userRoute.delete("/XoaNguoiDung", checkTokenInAPI, deleteUser)

module.exports = userRoute;


