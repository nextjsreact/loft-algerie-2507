"use client";

import React, { useState, useEffect } from 'react';
import { Notification } from '@/components/ui/notification';
import { type Notification as NotificationType } from '@/lib/types';
import { markNotificationAsReadAndNotifySender, getNotifications } from '@/app/actions/notifications';
import { createClient } from '@/utils/supabase/client';
import { useNotifications } from '@/components/providers/notification-context';

interface NotificationsListProps {
  notifications: NotificationType[];
}

export default function NotificationsList({ notifications: initialNotifications }: NotificationsListProps) {
  const [notifications, setNotifications] = useState<NotificationType[]>(initialNotifications);
  const { refreshNotifications } = useNotifications();
  const supabase = createClient();

  const handleNotificationClick = async (id: string) => {
    await markNotificationAsReadAndNotifySender(id);
    
    // Update local state
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, is_read: true } : n)
    );
    
    // Refresh notification count
    refreshNotifications();
  };

  // Set up real-time subscription for new notifications
  useEffect(() => {
    const subscription = supabase
      .channel('notifications-list')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications'
        },
        async (payload) => {
          console.log('🔔 New notification in list:', payload);
          
          // Add new notification to the list
          const newNotification = payload.new as NotificationType;
          setNotifications(prev => [newNotification, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications'
        },
        async (payload) => {
          console.log('🔔 Notification updated in list:', payload);
          
          // Update notification in the list
          const updatedNotification = payload.new as NotificationType;
          setNotifications(prev => 
            prev.map(n => n.id === updatedNotification.id ? updatedNotification : n)
          );
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

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
            onClick={() => handleNotificationClick(notification.id)}
          />
        ))
      )}
    </>
  );
}
