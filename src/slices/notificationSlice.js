import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    notifications: [],
    unreadCount: 0,
  },
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter(n => !n.read).length;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
    markAsRead: (state, action) => {
      const index = state.notifications.findIndex(n => n._id === action.payload);
      if (index !== -1 && !state.notifications[index].read) {
        state.notifications[index].read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.notifications = state.notifications.map(n => ({ ...n, read: true }));
      state.unreadCount = 0;
    }
  },
});

export const { setNotifications, addNotification, markAsRead, markAllAsRead } = notificationSlice.actions;
export default notificationSlice.reducer;