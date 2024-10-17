// notificationSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface NotificationState {
  visible: boolean;
  message: string;
}

const initialState: NotificationState = {
  visible: false,
  message: "",
};

const notificationReducer = createSlice({
  name: "notificationReducer",
  initialState,
  reducers: {
    showNotification: (state, action: PayloadAction<string>) => {
      state.visible = true;
      state.message = action.payload;
    },
    hideNotification: (state) => {
      state.visible = false;
      state.message = "";
    },
  },
});

export const { showNotification, hideNotification } =
  notificationReducer.actions;

export default notificationReducer.reducer;
