import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    pageData: null,
    loading: false,
    userPage:null,
    adData:[]

};

const pageSlice = createSlice({
    name: "page",
    initialState,
    reducers: {
        setPageData(state, action) {
            state.pageData = action.payload;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setUserPages(state, action) {
            state.userPage = action.payload;
        },
        setAdPages(state, action) {
            state.adData = action.payload;
        }
    },
});

export const { setPageData, setLoading,setUserPages,setAdPages } = pageSlice.actions;
export default pageSlice.reducer;
