"use client";

import React from 'react';
import { Notification } from '@/components/ui/notification';
import { type Notification as NotificationType } from '@/lib/types';

interface NotificationsListProps {
  notifications: NotificationType[]; // Changed from initialNotifications to notifications
  onDismiss: (id: string) => Promise<void>;
}

export default function NotificationsList({ notifications, onDismiss }: NotificationsListProps) {
  // Removed useNotifications hook for initial data
  
  const handleDismiss = async (id: string) => {
    await onDismiss(id);
  };

  return (
    <>
      {notifications.length === 0 ? (
        <p>No new notifications.</p>
      ) : (
        notifications.map((notification) => (
          <Notification
            key={notification.id}
            title={notification.title}
            message={notification.message}
            isRead={notification.is_read}
            link={notification.link}
            onDismiss={() => handleDismiss(notification.id)}
          />
        ))
      )}
    </>
  );
}
