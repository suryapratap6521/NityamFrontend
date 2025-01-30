import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  adData: {},  // Default state is an empty object
  loading: false,
  communities:[]
};

const adSlice = createSlice({
  name: "ad",  // Slice name is 'ad'
  initialState,
  reducers: {
    setAdData(state, action) {
      state.adData = { ...state.adData, ...action.payload };
    },
    setLoading(state, action) {
      state.loading = action.payload;  // Set loading state
    },
    setCommunities(state, action) {
      state.communities = action.payload;
  },
  },
});

export const { setAdData, setLoading, setCommunities} = adSlice.actions;
export default adSlice.reducer;
