import { createSlice } from "@reduxjs/toolkit";
import {
  USER_LOGIN,
  getDataJsonStorage,
  removeDataJsonStorage,
  removeDataTextStorage,
} from "../../util/utilMethod";
import { UserReducerType } from "../../Model/Model";

const initialState: UserReducerType = {
  userLogin: getDataJsonStorage(USER_LOGIN),
};

const authReducer = createSlice({
  name: "userReducer",
  initialState,
  reducers: {
    logout: (state) => {
      state.userLogin = null;
      removeDataTextStorage(USER_LOGIN);
      removeDataJsonStorage(USER_LOGIN);
    },
  },
});

export const { logout } = authReducer.actions;
export default authReducer.reducer;
