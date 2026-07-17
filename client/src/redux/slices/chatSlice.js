// client/src/redux/slices/chatSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchConversations = createAsyncThunk(
    'chat/fetchConversations',
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get('/api/chat/conversations');
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch conversations');
        }
    }
);

export const fetchMessages = createAsyncThunk(
    'chat/fetchMessages',
    async (conversationId, { rejectWithValue }) => {
        try {
            const res = await api.get(`/api/chat/messages/${conversationId}`);
            return { conversationId, messages: res.data };
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch messages');
        }
    }
);

export const sendMessage = createAsyncThunk(
    'chat/sendMessage',
    async ({ conversationId, text, image }, { rejectWithValue }) => {
        try {
            const res = await api.post(`/api/chat/messages/${conversationId}`, { text, image });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to send message');
        }
    }
);

export const startConversation = createAsyncThunk(
    'chat/startConversation',
    async (userId, { rejectWithValue }) => {
        try {
            const res = await api.post('/api/chat/conversations', { userId });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to start conversation');
        }
    }
);

const initialState = {
    conversations: [],
    currentConversation: null,
    messages: {},
    isLoading: false,
    error: null,
    onlineUsers: [],
    typingUsers: [],
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setConversations: (state, action) => {
            state.conversations = action.payload;
        },
        setCurrentConversation: (state, action) => {
            state.currentConversation = action.payload;
        },
        addMessage: (state, action) => {
            const { conversationId, message } = action.payload;
            if (!state.messages[conversationId]) {
                state.messages[conversationId] = [];
            }
            state.messages[conversationId].push(message);
        },
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        },
        setTyping: (state, action) => {
            const { userId, isTyping } = action.payload;
            if (isTyping) {
                if (!state.typingUsers.includes(userId)) {
                    state.typingUsers.push(userId);
                }
            } else {
                state.typingUsers = state.typingUsers.filter((id) => id !== userId);
            }
        },
        updateLastMessage: (state, action) => {
            const { conversationId, message } = action.payload;
            const conv = state.conversations.find((c) => c._id === conversationId);
            if (conv) {
                conv.lastMessage = message;
                conv.updatedAt = new Date().toISOString();
            }
        },
        markAsRead: (state, action) => {
            const { conversationId } = action.payload;
            const conv = state.conversations.find((c) => c._id === conversationId);
            if (conv) {
                conv.unreadCount = 0;
            }
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Conversations
            .addCase(fetchConversations.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchConversations.fulfilled, (state, action) => {
                state.isLoading = false;
                state.conversations = action.payload;
            })
            .addCase(fetchConversations.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Fetch Messages
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.messages[action.payload.conversationId] = action.payload.messages;
            })
            // Send Message
            .addCase(sendMessage.fulfilled, (state, action) => {
                const msg = action.payload;
                const convId = msg.conversationId;
                if (!state.messages[convId]) {
                    state.messages[convId] = [];
                }
                state.messages[convId].push(msg);
                // Update last message in conversation list
                const conv = state.conversations.find((c) => c._id === convId);
                if (conv) {
                    conv.lastMessage = msg;
                    conv.updatedAt = new Date().toISOString();
                }
            })
            // Start Conversation
            .addCase(startConversation.fulfilled, (state, action) => {
                const conv = action.payload;
                if (!state.conversations.find((c) => c._id === conv._id)) {
                    state.conversations.unshift(conv);
                }
                state.currentConversation = conv;
            });
    },
});

export const {
    setConversations,
    setCurrentConversation,
    addMessage,
    setOnlineUsers,
    setTyping,
    updateLastMessage,
    markAsRead,
    clearError,
} = chatSlice.actions;

export default chatSlice.reducer;