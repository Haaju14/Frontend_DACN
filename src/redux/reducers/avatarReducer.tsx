// notificationSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { getDataJsonStorage, USER_LOGIN } from "../../util/utilMethod";

export interface AvatarReducerType {
  avatar: string;
  TenDangNhap: string;
}
const initialState: AvatarReducerType = {
  avatar: getDataJsonStorage(USER_LOGIN)?.user?.avatar,
  TenDangNhap: getDataJsonStorage(USER_LOGIN)?.user?.name,
};

const avatarReducer = createSlice({
  name: "avatarReducer",
  initialState,
  reducers: {
    updateAvatar: (state, action) => {
      state.avatar = action.payload;
    },
    updateName: (state, action) => {
      state.TenDangNhap = action.payload;
    },
  },
});

export const { updateAvatar, updateName } = avatarReducer.actions;

export default avatarReducer.reducer;
