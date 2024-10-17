import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  USER_LOGIN,
  getDataJsonStorage,
  removeDataJsonStorage,
  removeDataTextStorage,
} from "../../util/utilMethod";

interface User {
  IDNguoiDung: number;
  TenDangNhap: string;
  Email: string;
  MatKhau: string;
  HoTen: string;
  GioiTinh: boolean;
  SDT: string;
  Role: string;
  AnhDaiDien?: string;
}

export interface UserReducerType {
  token: string | undefined; // Đặt là string hoặc undefined
  userLogin: UserLogin | null;
}

export interface UserLogin {
  user: User;
  token: string;
}

const initialState: UserReducerType = {
  userLogin: getDataJsonStorage(USER_LOGIN),
  token: undefined,
};

const authReducer = createSlice({
  name: "userReducer",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserLogin>) => {
      // Cập nhật thông tin người dùng và token
      state.userLogin = action.payload; // Cập nhật userLogin
      state.token = action.payload.token; // Cập nhật token
      // Lưu thông tin vào localStorage nếu cần
      localStorage.setItem(USER_LOGIN, JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.userLogin = null;
      state.token = undefined; // Xóa token khi logout
      removeDataTextStorage(USER_LOGIN);
      removeDataJsonStorage(USER_LOGIN);
    },
  },
});

export const { login, logout } = authReducer.actions;
export default authReducer.reducer;
