import { configureStore } from '@reduxjs/toolkit'
import mainReducer from './slices/mainSlice'
import authReducer from './slices/authSlice'

export const store = configureStore({
  reducer: {
    main: mainReducer,
    auth: authReducer
  }
})
