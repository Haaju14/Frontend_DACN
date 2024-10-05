import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userReducer";
import notificationReducer from "./reducers/notificationReducer";
import bookReducer from "./reducers/bookReducer";
import avatarReducer from "./reducers/avatarReducer";

export const store = configureStore({
  reducer: {
    number: (state: number = 1) => state,
    userReducer,
    notificationReducer,
    bookReducer,
    avatarReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type DispatchType = typeof store.dispatch;
export type GetStateMethodType = typeof store.getState;
