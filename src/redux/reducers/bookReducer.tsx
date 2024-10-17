import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BuyCard } from "../../user/Components/Detail/BuyCard";
import {
  BUY,
  getDataJsonStorage,
  removeDataJsonStorage,
  setDataJsonStorage,
} from "../../util/utilMethod";

export interface BuyCourseType {
  buyCard: BuyCard | null;  // Use camelCase for better consistency with JS/TS conventions
}

const initialState: BuyCourseType = {
  buyCard: getDataJsonStorage(BUY),  // Fetch initial value from storage
};

const bookReducer = createSlice({
  name: "bookReducer",
  initialState,
  reducers: {
    editBooking: (state, action: PayloadAction<BuyCard>) => {
      state.buyCard = action.payload;
      setDataJsonStorage(BUY, action.payload); // Store updated buyCard in local storage
    },
    deleteBooking: (state) => {
      state.buyCard = null;
      removeDataJsonStorage(BUY); // Remove buyCard from local storage
    },
  },
});

export const { editBooking, deleteBooking } = bookReducer.actions;

export default bookReducer.reducer;
