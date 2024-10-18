import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  BUY,
  getDataJsonStorage,
  removeDataJsonStorage,
  setDataJsonStorage,
} from "../../util/utilMethod";

export interface BuyCard {
  
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
