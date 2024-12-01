import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    pageData: null,
    loading: false,
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
    },
});

export const { setPageData, setLoading } = pageSlice.actions;
export default pageSlice.reducer;
