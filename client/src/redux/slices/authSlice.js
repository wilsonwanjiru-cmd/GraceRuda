// client/src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { setAuthToken, removeAuthToken } from '../../utils/helpers';

export const register = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const res = await api.post('/api/auth/register', userData);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Registration failed');
        }
    }
);

export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const res = await api.post('/api/auth/login', credentials);
            const { token, user } = res.data;
            setAuthToken(token);
            return { user, token };
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Login failed');
        }
    }
);

export const loadUser = createAsyncThunk(
    'auth/loadUser',
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get('/api/auth/me');
            return res.data;
        } catch (err) {
            removeAuthToken();
            return rejectWithValue(err.response?.data?.message || 'Not authenticated');
        }
    }
);

export const logout = createAsyncThunk('auth/logout', async () => {
    removeAuthToken();
    return null;
});

export const verifyEmail = createAsyncThunk(
    'auth/verifyEmail',
    async (token, { rejectWithValue }) => {
        try {
            const res = await api.post('/api/auth/verify-email', { token });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Verification failed');
        }
    }
);

export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async (email, { rejectWithValue }) => {
        try {
            const res = await api.post('/api/auth/forgot-password', { email });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to send reset email');
        }
    }
);

export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async ({ token, password }, { rejectWithValue }) => {
        try {
            const res = await api.post('/api/auth/reset-password', { token, password });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Password reset failed');
        }
    }
);

const initialState = {
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    isLoading: true,
    error: null,
    success: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSuccess: (state) => {
            state.success = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Register
            .addCase(register.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.success = action.payload.message || 'Registration successful. Please verify your email.';
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Login
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Load User
            .addCase(loadUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(loadUser.rejected, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
            })
            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.error = null;
            })
            // Verify Email
            .addCase(verifyEmail.fulfilled, (state, action) => {
                state.success = action.payload.message || 'Email verified successfully!';
            })
            .addCase(verifyEmail.rejected, (state, action) => {
                state.error = action.payload;
            })
            // Forgot Password
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.success = action.payload.message || 'Password reset email sent.';
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.error = action.payload;
            })
            // Reset Password
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.success = action.payload.message || 'Password reset successful. Please login.';
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export const { clearError, clearSuccess } = authSlice.actions;
export default authSlice.reducer;