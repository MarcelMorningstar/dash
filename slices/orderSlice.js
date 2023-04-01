import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orderToken: null,
  orderType: 'taxi',
  orderInformation: {}
}

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrderToken: (state, action) => {
      state.orderToken = action.payload;
    },
    setOrderType: (state, action) => {
      state.orderType = action.payload;
    },
    setOrderInformation: (state, action) => {
      Object.assign(state.orderInformation, action.payload);
    }
  }
})

export const { setOrderToken, setOrderType, setOrderInformation } = orderSlice.actions

export const selectOrderToken = (state) => state.order.orderToken
export const selectOrderType = (state) => state.order.orderType
export const selectOrderInformation = (state) => state.order.orderInformation

export default orderSlice.reducer