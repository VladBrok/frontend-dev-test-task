import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../store"

export interface IUser {
  uuid: string
  login: string
  passwordHash: string
  phone: string
}

export interface IUserState {
  current: IUser | null
}

const initialState: IUserState = {
  current: null,
}

export const usersSlice = createSlice({
  name: "users",
  initialState: initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<IUser>) => {
      const user = action.payload
      state.current = user
    },
  },
})

export const { setCurrentUser } = usersSlice.actions

export const selectCurrentUser = (state: RootState): IUser | null =>
  state.users.current

export default usersSlice.reducer
