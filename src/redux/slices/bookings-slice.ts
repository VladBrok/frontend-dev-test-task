import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { IBooking } from "../../lib/types"
import { RootState } from "../store"

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
    cancelBooking: (state, action: PayloadAction<string>) => {
      const uuid = action.payload
      state.list = state.list.filter((booking) => booking.uuid !== uuid)
    },
    addBooking: (state, action: PayloadAction<IBooking>) => {
      const booking = action.payload
      state.list.push(booking)
    },
  },
})

export const { setBookings, cancelBooking, addBooking } = bookingsSlice.actions

export const selectBookingsOfUser = (userUuid: string) => (state: RootState) =>
  state.bookings.list.filter((x) => x.userUuid === userUuid)

export default bookingsSlice.reducer
