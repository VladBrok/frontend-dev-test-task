import { PayloadAction, createSlice } from "@reduxjs/toolkit"

export interface IToast {
  isActive: boolean
  text?: string
}

const initialState: IToast = {
  isActive: false,
  text: "",
}

export const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    setToast: (state, action: PayloadAction<IToast>) => {
      return action.payload
    },
  },
})

export const { setToast } = toastSlice.actions

export default toastSlice.reducer
