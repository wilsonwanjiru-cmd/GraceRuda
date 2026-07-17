// client/src/redux/slices/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchUsers = createAsyncThunk(
    'user/fetchUsers',
    async (filters, { rejectWithValue }) => {
        try {
            const res = await api.get('/api/users', { params: filters });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch users');
        }
    }
);

export const fetchUserById = createAsyncThunk(
    'user/fetchUserById',
    async (id, { rejectWithValue }) => {
        try {
            const res = await api.get(`/api/users/${id}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch user');
        }
    }
);

export const updateProfile = createAsyncThunk(
    'user/updateProfile',
    async (data, { rejectWithValue }) => {
        try {
            const res = await api.put('/api/users/profile', data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update profile');
        }
    }
);

export const uploadPhoto = createAsyncThunk(
    'user/uploadPhoto',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await api.post('/api/users/upload-photo', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to upload photo');
        }
    }
);

export const deletePhoto = createAsyncThunk(
    'user/deletePhoto',
    async (photoUrl, { rejectWithValue }) => {
        try {
            const res = await api.delete('/api/users/photo', { data: { photoUrl } });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete photo');
        }
    }
);

const initialState = {
    users: [],
    currentUser: null,
    profileUser: null,
    isLoading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearProfileUser: (state) => {
            state.profileUser = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(fetchUserById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchUserById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.profileUser = action.payload;
            })
            .addCase(fetchUserById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.currentUser = action.payload;
                state.profileUser = action.payload;
            })
            .addCase(uploadPhoto.fulfilled, (state, action) => {
                if (state.currentUser) {
                    state.currentUser.photos = action.payload.photos;
                }
                if (state.profileUser) {
                    state.profileUser.photos = action.payload.photos;
                }
            })
            .addCase(deletePhoto.fulfilled, (state, action) => {
                if (state.currentUser) {
                    state.currentUser.photos = action.payload.photos;
                }
                if (state.profileUser) {
                    state.profileUser.photos = action.payload.photos;
                }
            });
    },
});

export const { clearError, clearProfileUser } = userSlice.actions;
export default userSlice.reducer;