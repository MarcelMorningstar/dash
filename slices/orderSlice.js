import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orderToken: null,
  orderInformation: null
}

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrderToken: (state, action) => {
      state.orderToken = action.payload;
    },
    setOrderInformation: (state, action) => {
      state.orderInformation = action.payload;
    },
  }
})

export const { setOrderToken, setOrderInformation } = orderSlice.actions

export const selectOrderToken = (state) => state.order.orderToken
export const selectOrderInformation = (state) => state.order.orderInformation

export default orderSlice.reducer