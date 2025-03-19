import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    serviceData: null,
    loading: false,
    userService:null,
    adData:[]

};

const serviceSlice = createSlice({
    name: "service",
    initialState,
    reducers: {
        setServiceData(state, action) {
            state.serviceData = action.payload;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setUserServices(state, action) {
            state.userService = action.payload;
        },
        setAdServices(state, action) {
            state.adData = action.payload;
        }
    },
});

export const { setServiceData, setLoading,setUserServices,setAdServices } = serviceSlice.actions;
export default serviceSlice.reducer;
