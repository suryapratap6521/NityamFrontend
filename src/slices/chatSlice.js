// slices/postSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  selectedChat: null,
  chats:[],
  notification:[],
};

const chatSlice = createSlice({
  name: "chat",
  initialState: initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setSelectedChat(state, action) {
      state.selectedChat = action.payload;
    },
    setChats(state,action){
        state.chats=action.payload;
    },
    setNotification(state,action){
      state.notification=action.payload;
    }
  },
});

export const { setLoading, setSelectedChat, setChats,setNotification } = chatSlice.actions;

export default chatSlice.reducer;

