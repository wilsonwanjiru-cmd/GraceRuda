// client/src/redux/slices/notificationSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],      // array of notification objects
  unreadCount: 0,        // total unread notifications
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    // Add a new notification to the top of the list and increment unread count
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
    // Mark all notifications as read (reset unread count)
    markAllAsRead: (state) => {
      state.unreadCount = 0;
    },
    // Clear all notifications (reset everything)
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
});

// Export actions
export const { addNotification, markAllAsRead, clearNotifications } = notificationSlice.actions;

// Export reducer to be added to the store
export default notificationSlice.reducer;