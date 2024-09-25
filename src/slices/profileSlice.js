import {createSlice} from '@reduxjs/toolkit'
import Cookies from "js-cookie";
const initialState={
    user:Cookies.get("user")?JSON.parse(Cookies.get("user")):null,
    loading: false,
}

const profileSlice = createSlice({
    name:"profile",
    initialState:initialState,
    reducers:{
        setUser(state,value){
            state.user = value.payload;
        },
        setLoading(state,value){
            state.loading = value.payload;
        },

    },
})

export const {setUser, setLoading} = profileSlice.actions;
export default profileSlice.reducer;