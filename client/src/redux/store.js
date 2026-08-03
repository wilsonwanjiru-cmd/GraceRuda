// client/src/redux/store.js
// client/src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import chatReducer from './slices/chatSlice';
import matchReducer from './slices/matchSlice';
import uiReducer from './slices/uiSlice';
import notificationReducer from './slices/notificationSlice'; // 👈 new

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    chat: chatReducer,
    match: matchReducer,
    ui: uiReducer,
    notification: notificationReducer, // 👈 new
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});