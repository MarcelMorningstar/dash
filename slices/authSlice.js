import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userToken: null,
  userInfo: {},
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
  }
})

export const { setUserToken, setUserInfo } = authSlice.actions

export const selectUserToken = (state) => state.auth.userToken
export const selectUserInfo = (state) => state.auth.userInfo

export default authSlice.reducer
