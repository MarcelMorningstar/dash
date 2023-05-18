import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orderToken: null,
  orderType: 'taxi',
  orderAdditions: [],
  orderInformation: {},
  driver: null,
  car: null
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
    setOrderAdditions: (state, action) => {
      state.orderAdditions = action.payload;
    },
    setOrderInformation: (state, action) => {
      Object.assign(state.orderInformation, action.payload);
    },
    setDriver: (state, action) => {
      state.driver = action.payload;
    },
    setCar: (state, action) => {
      state.car = action.payload;
    },
  }
})

export const { setOrderToken, setOrderType, setOrderAdditions, setOrderInformation, setDriver, setCar } = orderSlice.actions

export const selectOrderToken = (state) => state.order.orderToken
export const selectOrderType = (state) => state.order.orderType
export const selectOrderAdditions = (state) => state.order.orderAdditions
export const selectOrderInformation = (state) => state.order.orderInformation
export const selectDriver = (state) => state.order.driver
export const selectCar = (state) => state.order.car

export default orderSlice.reducer