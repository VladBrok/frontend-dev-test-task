import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
import usersReducer from "./slices/users-slice"
import bookingsReducer from "./slices/bookings-slice"

export const store = configureStore({
  reducer: {
    users: usersReducer,
    bookings: bookingsReducer,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
