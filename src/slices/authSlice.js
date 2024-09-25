import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState={
    signUpData: null,
    loading:false,
    token: Cookies.get("token")?JSON.parse(Cookies.get("token")):null,

}

 const authSlice=createSlice({
    name:"auth",
    initialState:initialState,
    reducers:{
        SetSignUpData(state,value){
            state.signUpData=value.payload;
        },
        setLoading(state,value){
            state.loading=value.payload;
        },
        setToken(state,value){
            state.token=value.payload;
        },
    },
})



export const {SetSignUpData,setLoading,setToken}=authSlice.actions;
export default authSlice.reducer;