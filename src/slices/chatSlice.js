import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  selectedChat: null,
  chats: [],
  notification: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setSelectedChat(state, action) {
      state.selectedChat = action.payload;
    },
    setChats(state, action) {
      state.chats = action.payload;
    },
    setNotification(state, action) {
      state.notification = action.payload;
    },
    updateChatPreview(state, action) {
      const { chatId, latestMessage, unreadCount } = action.payload;
      const chatIndex = state.chats.findIndex(c => c._id === chatId);
      if (chatIndex !== -1) {
        const chat = state.chats[chatIndex];
        chat.latestMessage = latestMessage;

        const ucIndex = chat.unreadCounts.findIndex(
          (uc) => uc.user === state.selectedChat?.users?.[0]?._id || ""
        );

        if (ucIndex !== -1) {
          chat.unreadCounts[ucIndex].count = unreadCount;
        } else {
          chat.unreadCounts.push({ user: state.user?._id, count: unreadCount });
        }

        // Move to top
        state.chats.splice(chatIndex, 1);
        state.chats.unshift(chat);
      }
    },
  },
});

export const {
  setLoading,
  setSelectedChat,
  setChats,
  setNotification,
  updateChatPreview,
} = chatSlice.actions;

export default chatSlice.reducer;
