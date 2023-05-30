import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { IBooking } from "../../lib/types"

export interface IBookingsState {
  list: IBooking[]
}

const initialState: IBookingsState = {
  list: [],
}

export const bookingsSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    setBookings: (state, action: PayloadAction<IBooking[]>) => {
      const bookings = action.payload
      state.list = bookings
    },
  },
})

export const { setBookings } = bookingsSlice.actions

export default bookingsSlice.reducer
