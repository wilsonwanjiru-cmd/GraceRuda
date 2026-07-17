// client/src/services/socket.js
import io from 'socket.io-client';
import { store } from '../redux/store';
import { addMessage, setOnlineUsers, setTyping, updateLastMessage, markAsRead } from '../redux/slices/chatSlice';
import { addMatch } from '../redux/slices/matchSlice';

let socket = null;

export const initSocket = (userId) => {
    if (socket) {
        socket.disconnect();
    }

    socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
        query: { userId },
        transports: ['websocket'],
    });

    socket.on('connect', () => {
        console.log('Socket connected');
    });

    socket.on('online-users', (users) => {
        store.dispatch(setOnlineUsers(users));
    });

    socket.on('receive-message', (message) => {
        const state = store.getState();
        const currentConv = state.chat.currentConversation;

        // Add message to messages list
        store.dispatch(addMessage({
            conversationId: message.conversationId,
            message,
        }));

        // Update last message in conversation list
        store.dispatch(updateLastMessage({
            conversationId: message.conversationId,
            message,
        }));

        // If this is the current conversation, mark as read
        if (currentConv && currentConv._id === message.conversationId) {
            store.dispatch(markAsRead({ conversationId: message.conversationId }));
            socket.emit('mark-read', message.conversationId);
        }
    });

    socket.on('typing', ({ userId, isTyping }) => {
        store.dispatch(setTyping({ userId, isTyping }));
    });

    socket.on('new-match', (match) => {
        store.dispatch(addMatch(match));
        // Show notification
        console.log('New match!', match);
    });

    socket.on('disconnect', () => {
        console.log('Socket disconnected');
    });

    return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

export const emitTyping = (conversationId, isTyping) => {
    if (socket) {
        socket.emit('typing', { conversationId, isTyping });
    }
};

export const emitMarkRead = (conversationId) => {
    if (socket) {
        socket.emit('mark-read', conversationId);
    }
};