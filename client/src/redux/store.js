// client/src/redux/store.js
// client/src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import chatReducer from './slices/chatSlice';
import matchReducer from './slices/matchSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        chat: chatReducer,
        match: matchReducer,
        ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

// If you need type inference for useSelector/useDispatch in plain JS,
// you can use JSDoc comments instead, but for now we'll just export the store.
// For TypeScript support, rename the file to .ts and add the type exports.