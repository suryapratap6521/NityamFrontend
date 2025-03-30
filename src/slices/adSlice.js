import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  adData: {
    title: "",
    description: "",
    "ageGroup[minAge]": "",
    "ageGroup[maxAge]": "",
    "dateSlot[startDate]": "",
    "dateSlot[endDate]": "",
    audianceType: "allUsers",
    "buttonLabel[type]": "",
    "buttonLabel[value]": "",
    communities: [],
    // Optionally add images: []
  },
  loading: false,
  communities: [],
  allAds: [],
};

const adSlice = createSlice({
  name: "ad",
  initialState,
  reducers: {
    setAdData(state, action) {
      state.adData = { ...state.adData, ...action.payload };
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setCommunities(state, action) {
      state.communities = action.payload;
    },
    setAllAds(state, action) {
      state.allAds = action.payload;
      state.error = null;
      localStorage.setItem("ad", JSON.stringify(action.payload));
    },
  },
});

export const { setAdData, setLoading, setCommunities, setAllAds } = adSlice.actions;
export default adSlice.reducer;
