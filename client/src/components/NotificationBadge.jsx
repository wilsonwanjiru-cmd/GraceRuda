// client/src/components/NotificationBadge.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import './NotificationBadge.css';

const NotificationBadge = () => {
  const unreadCount = useSelector((state) => state.notification.unreadCount);

  if (unreadCount === 0) return null;

  return <span className="notification-badge">{unreadCount}</span>;
};

export default NotificationBadge;