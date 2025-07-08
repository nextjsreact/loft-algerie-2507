import { User, UserRole, Loft, LoftStatus } from "@/lib/types";
import { createClient } from '@/utils/supabase/server'; // Import the new createClient

export async function ensureUsersTable() {
  // This function is no longer needed as Supabase handles the database schema
  // through its own migration system.
  console.warn("ensureUsersTable() is deprecated and no longer performs any database operations.");
  return; // No action needed as Supabase handles schema.
}

export async function createUser(
  email: string,
  password_hash: string,
  full_name?: string,
) {
  const supabase = await createClient(); // Create client here
  const { data, error } = await supabase.auth.signUp({
    email,
    password: password_hash,
    options: {
      data: {
        full_name,
        role: 'member',
      },
    },
  });

  if (error) {
    console.error('Error creating user:', error)
    throw error
  }

  return data
}

export async function getUserWithRelations(email: string) {
  const supabase = await createClient(); // Create client here
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', email)
    .single()

  if (error) {
    console.error('Error getting user by email:', error)
    throw error
  }

  return data as User | undefined
}

export async function getAllLofts() {
  const supabase = await createClient(); // Create client here
  const { data, error } = await supabase
    .from('lofts')
    .select('*')

  if (error) {
    console.error('Error getting all lofts:', error)
    throw error
  }

  return data as Loft[] | undefined
}

export async function getOwnerLofts(ownerId: string) {
  const supabase = await createClient(); // Create client here
  const { data, error } = await supabase
    .from('lofts')
    .select('*')
    .eq('owner_id', ownerId)

  if (error) {
    console.error('Error getting owner lofts:', error)
    throw error
  }

  return data as Loft[] | undefined
}
