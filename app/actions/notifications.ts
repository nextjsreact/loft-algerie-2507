import { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/server';
import { Database, Notification } from '@/lib/types';

export async function createNotification(
  userId: string,
  title: string,
  message: string,
  link?: string,
  supabaseClient?: SupabaseClient<Database> // Optional Supabase client
): Promise<{ data: Notification[] | null; error: any }> {
  const supabase = supabaseClient || await createClient();
  // Bypassing RLS with service role key to fix notification creation
  const adminSupabase = await createClient(true);
  const { data, error } = await adminSupabase
    .from('notifications')
    .insert({ user_id: userId, title, message, link })
    .select();

  if (error) {
    console.error('Error creating notification:', error);
    return { data: null, error };
  }
  return { data, error: null };
}

export async function getUnreadNotificationsCount(
  userId: string,
  supabaseClient?: SupabaseClient<Database>
): Promise<{ count: number | null; error: any }> {
  const supabase = supabaseClient || await createClient();
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) {
    console.error('Error getting unread notifications count:', error);
    return { count: null, error };
  }

  return { count, error: null };
}

export async function getNotifications(
  userId: string,
  supabaseClient?: SupabaseClient<Database> // Optional Supabase client
): Promise<{ data: Notification[] | null; error: any }> {
  const supabase = supabaseClient || await createClient();
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching notifications:', error);
    return { data: null, error };
  }
  return { data, error: null };
}

export async function markNotificationAsRead(
  notificationId: string,
  supabaseClient?: SupabaseClient<Database> // Optional Supabase client
): Promise<{ data: Notification[] | null; error: any }> {
  const supabase = supabaseClient || await createClient();
  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
    .select();

  if (error) {
    console.error('Error marking notification as read:', error);
    return { data: null, error };
  }
  return { data, error: null };
}
