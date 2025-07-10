"use server";

import { createClient } from '@/utils/supabase/server';
import { Setting } from '@/lib/types';

export async function getSetting(key: string): Promise<{ data: Setting | null; error: any }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('key', key)
    .single();

  if (error) {
    console.error(`Error fetching setting with key ${key}:`, error);
    return { data: null, error };
  }
  return { data, error: null };
}

export async function updateSetting(key: string, value: any): Promise<{ data: Setting | null; error: any }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('settings')
    .upsert({ key, value }, { onConflict: 'key' })
    .select()
    .single();

  if (error) {
    console.error(`Error updating setting with key ${key}:`, error);
    return { data: null, error };
  }
  return { data, error: null };
}
