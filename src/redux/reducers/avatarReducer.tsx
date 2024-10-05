// notificationSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { getDataJsonStorage, USER_LOGIN } from "../../util/utilMethod";
import { AvatarReducerType } from "../../Model/Model";

const initialState: AvatarReducerType = {
  avatar: getDataJsonStorage(USER_LOGIN)?.user?.avatar,
  userName: getDataJsonStorage(USER_LOGIN)?.user?.name,
};

const avatarReducer = createSlice({
  name: "avatarReducer",
  initialState,
  reducers: {
    updateAvatar: (state, action) => {
      state.avatar = action.payload;
    },
    updateName: (state, action) => {
      state.userName = action.payload;
    },
  },
});

export const { updateAvatar, updateName } = avatarReducer.actions;

export default avatarReducer.reducer;
