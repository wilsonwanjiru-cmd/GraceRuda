// client/src/redux/slices/matchSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchMatches = createAsyncThunk(
    'match/fetchMatches',
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get('/api/matches');
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch matches');
        }
    }
);

export const likeUser = createAsyncThunk(
    'match/likeUser',
    async (userId, { rejectWithValue }) => {
        try {
            const res = await api.post('/api/likes', { userId });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to like user');
        }
    }
);

export const unlikeUser = createAsyncThunk(
    'match/unlikeUser',
    async (userId, { rejectWithValue }) => {
        try {
            const res = await api.delete(`/api/likes/${userId}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to unlike user');
        }
    }
);

const initialState = {
    matches: [],
    likes: [],
    likedBy: [],
    isLoading: false,
    error: null,
};

const matchSlice = createSlice({
    name: 'match',
    initialState,
    reducers: {
        addMatch: (state, action) => {
            state.matches.push(action.payload);
        },
        removeMatch: (state, action) => {
            state.matches = state.matches.filter((m) => m._id !== action.payload);
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMatches.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchMatches.fulfilled, (state, action) => {
                state.isLoading = false;
                state.matches = action.payload.matches || [];
                state.likes = action.payload.likes || [];
                state.likedBy = action.payload.likedBy || [];
            })
            .addCase(fetchMatches.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(likeUser.fulfilled, (state, action) => {
                const { match, liked } = action.payload;
                if (match) {
                    state.matches.push(match);
                }
                if (liked) {
                    state.likes.push(liked);
                }
            })
            .addCase(unlikeUser.fulfilled, (state, action) => {
                const { userId } = action.payload;
                state.likes = state.likes.filter((l) => l.targetUserId !== userId);
            });
    },
});

export const { addMatch, removeMatch, clearError } = matchSlice.actions;
export default matchSlice.reducer;