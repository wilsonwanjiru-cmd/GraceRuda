// server/sockets/index.js
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');

const onlineUsers = new Map();

const setupSocket = (io) => {
    io.on('connection', (socket) => {
        const userId = socket.handshake.query.userId;

        if (userId) {
            onlineUsers.set(userId, socket.id);
            io.emit('online-users', Array.from(onlineUsers.keys()));
        }

        // Join user's own room for direct messages
        if (userId) {
            socket.join(`user:${userId}`);
        }

        // Handle joining conversation
        socket.on('join-conversation', (conversationId) => {
            socket.join(`conversation:${conversationId}`);
        });

        // Handle leaving conversation
        socket.on('leave-conversation', (conversationId) => {
            socket.leave(`conversation:${conversationId}`);
        });

        // Handle typing indicator
        socket.on('typing', async ({ conversationId, isTyping }) => {
            const conversation = await Conversation.findById(conversationId);
            if (!conversation) return;

            const otherParticipant = conversation.participants.find(
                (p) => p.toString() !== userId
            );

            if (otherParticipant) {
                const otherSocketId = onlineUsers.get(otherParticipant.toString());
                if (otherSocketId) {
                    io.to(otherSocketId).emit('typing', {
                        userId,
                        isTyping,
                        conversationId,
                    });
                }
            }
        });

        // Handle mark as read
        socket.on('mark-read', async (conversationId) => {
            await Message.updateMany(
                {
                    conversationId,
                    sender: { $ne: userId },
                    readBy: { $ne: userId },
                },
                { $addToSet: { readBy: userId } }
            );

            // Emit to conversation room
            io.to(`conversation:${conversationId}`).emit('messages-read', {
                conversationId,
                userId,
            });
        });

        // Handle send message (for real-time)
        socket.on('send-message', async (data) => {
            const { conversationId, text, image } = data;
            // This is handled by the API, but we emit the message to the room
            // The API will save to DB and emit via the route
        });

        // Handle disconnect
        socket.on('disconnect', () => {
            if (userId) {
                onlineUsers.delete(userId);
                io.emit('online-users', Array.from(onlineUsers.keys()));
            }
        });
    });
};

module.exports = { setupSocket, onlineUsers };