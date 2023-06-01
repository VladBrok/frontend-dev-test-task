import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
import usersReducer from "./slices/users-slice"
import bookingsReducer from "./slices/bookings-slice"
import toastReducer from "./slices/toast-slice"

export const store = configureStore({
  reducer: {
    users: usersReducer,
    bookings: bookingsReducer,
    toast: toastReducer,
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
