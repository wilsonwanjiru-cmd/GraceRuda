// client/src/pages/Chat.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import {
  fetchConversations,
  fetchMessages,
  sendMessage,
  startConversation,
  setCurrentConversation,
  markAsRead,
} from '../redux/slices/chatSlice';
import { getSocket, emitTyping, emitMarkRead } from '../services/socket';
import { formatTime } from '../utils/helpers';
import api from '../services/api'; // 👈 for payment call
import './Chat.css';

const Chat = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.auth);
  const {
    conversations,
    currentConversation,
    messages,
    onlineUsers,
    typingUsers,
    isLoading,
  } = useSelector((state) => state.chat);
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  useEffect(() => {
    if (userId) {
      const existing = conversations.find((c) =>
        c.participants.some((p) => p._id === userId)
      );
      if (existing) {
        dispatch(setCurrentConversation(existing));
        dispatch(fetchMessages(existing._id));
        dispatch(markAsRead({ conversationId: existing._id }));
        emitMarkRead(existing._id);
      } else {
        dispatch(startConversation(userId)).then((res) => {
          if (res.payload) {
            dispatch(fetchMessages(res.payload._id));
          }
        });
      }
    } else {
      if (conversations.length > 0) {
        const conv = conversations[0];
        dispatch(setCurrentConversation(conv));
        dispatch(fetchMessages(conv._id));
        dispatch(markAsRead({ conversationId: conv._id }));
        emitMarkRead(conv._id);
      }
    }
  }, [userId, conversations, dispatch]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 👇 Handle send message with payment flow
  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !currentConversation) return;

    try {
      await dispatch(
        sendMessage({
          conversationId: currentConversation._id,
          text: text.trim(),
        })
      ).unwrap();
      setText('');
      setIsTyping(false);
      emitTyping(currentConversation._id, false);
    } catch (error) {
      // Check if the error indicates payment is needed
      if (error.needsPayment) {
        setShowPaymentModal(true);
        setPaymentMessage('');
        setPaymentSuccess(false);
      } else {
        alert(error.message || 'Failed to send message. Please try again.');
      }
    }
  };

  const handleTyping = (e) => {
    setText(e.target.value);
    if (!isTyping) {
      setIsTyping(true);
      if (currentConversation) {
        emitTyping(currentConversation._id, true);
      }
    }
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      if (currentConversation) {
        emitTyping(currentConversation._id, false);
      }
    }, 1000);
  };

  // 👇 Initiate M‑PESA STK Push
  const handlePayment = async () => {
    if (!phoneNumber.trim()) {
      setPaymentMessage('Please enter your M‑PESA phone number.');
      return;
    }
    setPaymentLoading(true);
    setPaymentMessage('');
    try {
      const response = await api.post('/api/payments/mpesa/stkpush', {
        phoneNumber: phoneNumber.trim(),
        amount: 10,
      });
      setPaymentSuccess(true);
      setPaymentMessage(`✅ Payment initiated! Check your phone for the M‑PESA prompt. 
                         Checkout ID: ${response.data.CheckoutRequestID || 'N/A'}`);
      // Optionally, poll for payment status or wait for webhook
      // For now, we'll close the modal after a few seconds and let the user try again.
      setTimeout(() => {
        setShowPaymentModal(false);
        // Refresh user data to update credits (optional)
        // dispatch(loadUser()) – you may need to import loadUser from authSlice
      }, 5000);
    } catch (error) {
      setPaymentMessage(
        error.response?.data?.message || 'Payment initiation failed. Please try again.'
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  const getOtherUser = (conv) => {
    return conv.participants.find((p) => p._id !== currentUser?._id);
  };

  const isOnline = (userId) => {
    return onlineUsers.includes(userId);
  };

  const isUserTyping = (conv) => {
    const other = getOtherUser(conv);
    return other && typingUsers.includes(other._id);
  };

  const messagesForConv = currentConversation
    ? messages[currentConversation._id] || []
    : [];

  return (
    <>
      <Helmet>
        <title>Chat | Ruda Dating</title>
        <meta name="description" content="Chat with your matches on Ruda Dating. Real-time messaging, typing indicators, and online status." />
      </Helmet>

      <div className="chat-container">
        {/* Conversations List (Sidebar) */}
        <div className="chat-sidebar">
          <div className="chat-sidebar-header">
            <h2>Messages</h2>
          </div>
          <div className="chat-list">
            {conversations.length === 0 ? (
              <div className="empty-conversations">
                <p>No conversations yet.</p>
                <p className="sub">Start liking and matching!</p>
              </div>
            ) : (
              conversations.map((conv) => {
                const other = getOtherUser(conv);
                return (
                  <div
                    key={conv._id}
                    className={`chat-list-item ${
                      currentConversation?._id === conv._id ? 'active' : ''
                    }`}
                    onClick={() => {
                      dispatch(setCurrentConversation(conv));
                      dispatch(fetchMessages(conv._id));
                      dispatch(markAsRead({ conversationId: conv._id }));
                      emitMarkRead(conv._id);
                      navigate(`/chat/${other?._id}`);
                    }}
                  >
                    <div className="avatar">
                      <span>👤</span>
                      {isOnline(other?._id) && <span className="online-dot"></span>}
                    </div>
                    <div className="info">
                      <h4>{other?.fullname || 'Unknown'}</h4>
                      <p>{conv.lastMessage?.text || 'No messages yet'}</p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="badge">{conv.unreadCount}</span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-main">
          {currentConversation ? (
            <>
              {/* Chat Header */}
              <div className="chat-main-header">
                <div className="avatar">
                  <span>👤</span>
                  {isOnline(getOtherUser(currentConversation)?._id) && (
                    <span className="online-dot"></span>
                  )}
                </div>
                <div className="info">
                  <h4>{getOtherUser(currentConversation)?.fullname || 'Unknown'}</h4>
                  <p>
                    {isOnline(getOtherUser(currentConversation)?._id)
                      ? 'Online'
                      : 'Offline'}
                  </p>
                </div>
                {isUserTyping(currentConversation) && (
                  <span className="typing-indicator">typing...</span>
                )}
              </div>

              {/* Messages */}
              <div className="chat-messages">
                {messagesForConv.map((msg) => {
                  const isMine = msg.sender === currentUser?._id;
                  return (
                    <div
                      key={msg._id}
                      className={`message ${isMine ? 'sent' : 'received'}`}
                    >
                      <div className="bubble">
                        {msg.text && <p>{msg.text}</p>}
                        {msg.image && (
                          <img
                            src={msg.image}
                            alt="shared"
                            className="shared-image"
                          />
                        )}
                        <span className="time">{formatTime(msg.createdAt)}</span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form className="chat-input" onSubmit={handleSend}>
                <input
                  type="text"
                  value={text}
                  onChange={handleTyping}
                  placeholder="Type a message..."
                />
                <button type="submit" disabled={!text.trim()}>
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="empty-chat">
              <div className="icon">💬</div>
              <p>Select a conversation to start chatting</p>
              <p className="sub">or browse profiles to find your match</p>
              <button
                onClick={() => navigate('/browse')}
                className="browse-link"
              >
                Browse Singles →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="modal-overlay payment-modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="modal-content payment-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowPaymentModal(false)}>✕</button>
            <h2>💳 Purchase Chat Credits</h2>
            <p>You've used your 5 free messages.</p>
            <p><strong>KES 10</strong> for <strong>50</strong> more messages.</p>
            {!paymentSuccess ? (
              <>
                <div className="payment-input-group">
                  <label htmlFor="phone">M‑PESA Phone Number</label>
                  <input
                    id="phone"
                    type="text"
                    placeholder="e.g. 254712345678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={paymentLoading}
                  />
                </div>
                {paymentMessage && <p className="payment-error">{paymentMessage}</p>}
                <button
                  className="btn-pay"
                  onClick={handlePayment}
                  disabled={paymentLoading}
                >
                  {paymentLoading ? 'Processing...' : 'Pay Now'}
                </button>
              </>
            ) : (
              <div className="payment-success">
                <p>✅ {paymentMessage}</p>
                <p className="payment-note">You will receive a prompt on your phone. Please complete the transaction.</p>
                <button
                  className="btn-close-payment"
                  onClick={() => setShowPaymentModal(false)}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Chat;