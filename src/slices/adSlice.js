import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  adData: {},  // Default state is an empty object
  loading: false,
  communities: [],
  allAds: [],
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
    setAllAds(state, action) {
      state.allAds = action.payload;
      state.error = null;
      localStorage.setItem("ad", JSON.stringify(action.payload));
    },
    resetAdData(state) {
      state.adData = {};  // Reset adData to empty object
    },
  },
});

export const { setAdData, setLoading, setCommunities, setAllAds, resetAdData } = adSlice.actions;
export default adSlice.reducer;
