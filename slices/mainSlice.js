import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  origin: null,
  destination: null
}

export const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    setOrigin: (state, action) => {
      state.origin = action.payload;
    },
    setDestination: (state, action) => {
      state.destination = action.payload;
    }
  }
})

export const { setOrigin, setDestination } = mainSlice.actions

export const selectOrigin = (state) => state.main.origin
export const selectDestination = (state) => state.main.destination

export default mainSlice.reducer
