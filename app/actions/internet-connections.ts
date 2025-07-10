"use server";

import { createClient } from '@/utils/supabase/server';
import { InternetConnectionType } from '@/lib/types';

export async function getInternetConnectionTypes(): Promise<InternetConnectionType[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('internet_connection_types')
    .select('*');

  if (error) {
    console.error('Error fetching internet connection types:', error);
    throw error;
  }
  return data || [];
}

export async function createInternetConnectionType(
  type: string,
  speed?: string | null,
  provider?: string | null,
  status?: string | null,
  cost?: number | null
): Promise<{ data: InternetConnectionType | null; error: any }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('internet_connection_types')
    .insert([{ type, speed, provider, status, cost }])
    .select()
    .single();

  if (error) {
    console.error('Error creating internet connection type:', error);
    return { data: null, error };
  }
  return { data, error: null };
}

export async function updateInternetConnectionType(
  id: string,
  updates: Partial<Omit<InternetConnectionType, 'id'>>
): Promise<{ data: InternetConnectionType | null; error: any }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('internet_connection_types')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating internet connection type:', error);
    return { data: null, error };
  }
  return { data, error: null };
}

export async function deleteInternetConnectionType(id: string): Promise<{ error: any }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('internet_connection_types')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting internet connection type:', error);
    return { error };
  }
  return { error: null };
}
