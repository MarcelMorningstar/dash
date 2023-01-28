import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
  userToken: null,
  userInfo: {},
}

export const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setUserToken: (state, action) => {
      state.userToken = action.payload;
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
  }
})

export const { setIsLoading, setUserToken, setUserInfo } = authSlice.actions

export const selectIsLoading = (state) => state.auth.isLoading
export const selectUserToken = (state) => state.auth.userToken
export const selectUserInfo = (state) => state.auth.userInfo

export default authSlice.reducer
