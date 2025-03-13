import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    eventData: null,
    loading: false,
    userEvent:null,
    adData:[]

};

const eventSlice = createSlice({
    name: "event",
    initialState,
    reducers: {
        setEventData(state, action) {
            state.eventData = action.payload;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setUserEvents(state, action) {
            state.userEvent = action.payload;
        },
        setAdEvents(state, action) {
            state.adData = action.payload;
        }
    },
});

export const { setEventData, setLoading,setUserEvents,setAdEvents } = eventSlice.actions;
export default eventSlice.reducer;
