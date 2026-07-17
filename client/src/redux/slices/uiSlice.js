// client/src/redux/slices/uiSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isSidebarOpen: false,
    isModalOpen: false,
    modalContent: null,
    notification: null,
    isLoading: false,
    theme: 'light',
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.isSidebarOpen = !state.isSidebarOpen;
        },
        openModal: (state, action) => {
            state.isModalOpen = true;
            state.modalContent = action.payload;
        },
        closeModal: (state) => {
            state.isModalOpen = false;
            state.modalContent = null;
        },
        setNotification: (state, action) => {
            state.notification = action.payload;
        },
        clearNotification: (state) => {
            state.notification = null;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        toggleTheme: (state) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
        },
    },
});

export const {
    toggleSidebar,
    openModal,
    closeModal,
    setNotification,
    clearNotification,
    setLoading,
    toggleTheme,
} = uiSlice.actions;

export default uiSlice.reducer;
