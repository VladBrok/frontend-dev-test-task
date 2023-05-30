import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../store"
import { IUser } from "../../lib/types"
import getUser from "../../dummy-backend/get-user"

export interface IUserState {
  current: IUser | null
}

const initialState: IUserState = {
  // TODO: set to null
  current: getUser("vlad"),
}

export const usersSlice = createSlice({
  name: "users",
  initialState,
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
