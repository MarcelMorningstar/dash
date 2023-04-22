import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userToken: null,
  userInfo: {},
  theme: 'automatic'
}

export const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserToken: (state, action) => {
      state.userToken = action.payload;
    },
    setUserInfo: (state, action) => {
      Object.assign(state.userInfo, action.payload);
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
  }
})

export const { setUserToken, setUserInfo, setTheme } = authSlice.actions

export const selectUserToken = (state) => state.auth.userToken
export const selectUserInfo = (state) => state.auth.userInfo
export const selectTheme = (state) => state.auth.theme

export default authSlice.reducer
