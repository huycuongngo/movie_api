const express = require('express');
const userRoute = express.Router();
const {
  getUserTypeList,
  getUserList,
  getUserListPagination,
  getUser,
  getUserPagination,
  logIn,
  signUp,
  getAccountInfo,
  getUserInfo,
  addUser,
  updateUserInfo,
  deleteUser
} = require('../controller/userController');


// GET
userRoute.get("/LayDanhSachLoaiNguoiDung", getUserTypeList);
userRoute.get("/LayDanhSachNguoiDung", getUserList)
userRoute.get("/LayDanhSachNguoiDungPhanTrang", getUserListPagination)
userRoute.get("/TimKiemNguoiDung", getUser)
userRoute.get("/TimKiemNguoiDungPhanTrang", getUserPagination)

// POST
userRoute.post("/DangNhap", logIn)
userRoute.post("/DangKy", signUp)
userRoute.post("/ThongTinTaiKhoan", getAccountInfo)
userRoute.post("/LayThongTinNguoiDung", getUserInfo)
userRoute.post("/ThemNguoiDung", addUser)

// PUT
userRoute.put("/CapNhatThongTinNguoiDung", updateUserInfo)

// DELETE
userRoute.delete("/XoaNguoiDung", deleteUser)

module.exports = userRoute;
