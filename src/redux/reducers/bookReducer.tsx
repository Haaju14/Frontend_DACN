// notificationSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BookingData, BookingReducerType } from "../../Model/Model"; // Adjust this import based on where your Booking type is defined
import {
  BOOK,
  getDataJsonStorage,
  removeDataJsonStorage,
  setDataJsonStorage,
} from "../../util/utilMethod";

const initialState: BookingReducerType = {
  bookingData: getDataJsonStorage(BOOK),
};

const bookReducer = createSlice({
  name: "bookReducer",
  initialState,
  reducers: {
    editBooking: (state, action: PayloadAction<BookingData>) => {
      state.bookingData = action.payload;
      setDataJsonStorage(BOOK, action.payload);
    },
    deleteBooking: (state) => {
      state.bookingData = null;
      removeDataJsonStorage(BOOK);
    },
  },
});

export const { editBooking, deleteBooking } = bookReducer.actions;

export default bookReducer.reducer;
