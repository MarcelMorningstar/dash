import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  origin: null,
  destination: null,
  travelInformation: null
}

export const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducer: {
    setOrigin: (state, action) => {
      state.origin = action.payload;
    },
    setDestination: (state, action) => {
      state.destination = action.payload;
    },
    setTravelInformation: (state, action) => {
      state.travelInformation = action.payload;
    },
  }
})

export const { setOrigin, setDestination, setTravelInformation } = mainSlice.actions

export const selectOrigin = (state) => state.main.origin
export const selectDestination = (state) => state.main.destination
export const selectTravelInformation = (state) => state.main.travelInformation

export default mainSlice.reducer
