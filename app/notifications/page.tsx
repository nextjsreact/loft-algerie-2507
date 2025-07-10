import React from 'react';
import { getNotifications, markNotificationAsRead } from '@/app/actions/notifications';
import { getSession } from '@/lib/auth';
import NotificationsList from './notifications-list';
import { revalidatePath } from 'next/cache';

import { redirect } from 'next/navigation';

export default async function NotificationsPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const handleDismiss = async (id: string) => {
    "use server";
    await markNotificationAsRead(id);
    revalidatePath('/notifications');
  };

  const { data: initialNotifications } = await getNotifications(session.user.id);

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Notifications</h1>
      <NotificationsList notifications={initialNotifications || []} onDismiss={handleDismiss} />
    </div>
  );
}
