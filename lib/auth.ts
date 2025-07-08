"use server"

import { NextResponse } from "next/server"
import { redirect } from "next/navigation"
import { createClient } from '@/utils/supabase/server'
import type { AuthSession } from "./types"

export async function getSession(): Promise<AuthSession | null> {
  console.log("getSession called");
  const supabase = await createClient(); // Create client here for each request

  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.log("No user found:", userError);
      return null;
    }

    // Directly use user_metadata for profile information
    const full_name = user.user_metadata?.full_name || null;
    const role = user.user_metadata?.role || 'member'; // Default role to 'member'

    const { data: { session: supabaseSessionData }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !supabaseSessionData) {
      console.log("No session data found:", sessionError);
      return null;
    }

    const newSession = {
      user: {
        id: user.id,
        email: user.email ?? null,
        full_name: full_name,
        role: role,
        created_at: user.created_at,
        updated_at: user.updated_at ?? null,
      },
      token: supabaseSessionData.access_token,
    };
    
    console.log('Current session:', newSession);
    return newSession;
  } catch (error) {
    console.error("Unexpected error in getSession:", error);
    
    // Try a fresh sign out on unexpected errors
    await (await createClient()).auth.signOut(); // Use new client for signOut
    return null;
  }
}

export async function requireAuth(): Promise<AuthSession> {
  const session = await getSession()
  if (!session) {
    redirect("/login")
  }
  return session
}

export async function requireRole(allowedRoles: string[]): Promise<AuthSession> {
  const session = await getSession()
  if (!session) {
    redirect("/login")
  }

  if (!allowedRoles.includes(session.user.role)) {
    redirect("/unauthorized")
  }

  return session
}

export async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function register(
  email: string,
  password: string,
  fullName: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: 'member',
      },
    },
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}

export async function requestPasswordReset(email: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/forgot-password`,
  })

  if (error) {
    console.error("Error in requestPasswordReset:", error)
    return { success: false, error: "An error occurred while processing your request." }
  }

  return { success: true }
}

export async function resetPassword(password: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    console.error("Error in resetPassword:", error)
    return { success: false, error: "An error occurred" }
  }

  return { success: true }
}
