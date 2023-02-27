import { configureStore } from '@reduxjs/toolkit'
import mainReducer from './slices/mainSlice'
import authReducer from './slices/authSlice'
import orderReducer from './slices/orderSlice'

export const store = configureStore({
  reducer: {
    main: mainReducer,
    auth: authReducer,
    order: orderReducer
  }
})
