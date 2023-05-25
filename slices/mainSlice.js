import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  origin: null,
  pickUp: null,
  destination: null,
  prices: null,
}

export const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    setOrigin: (state, action) => {
      state.origin = action.payload;
    },
    setPickUp: (state, action) => {
      state.pickUp = action.payload;
    },
    setDestination: (state, action) => {
      state.destination = action.payload;
    },
    setPrices: (state, action) => {
      state.prices = action.payload;
    }
  }
})

export const { setOrigin, setPickUp, setDestination, setPrices } = mainSlice.actions

export const selectOrigin = (state) => state.main.origin
export const selectPickUp = (state) => state.main.pickUp
export const selectDestination = (state) => state.main.destination
export const selectPrices = (state) => state.main.prices

export default mainSlice.reducer
