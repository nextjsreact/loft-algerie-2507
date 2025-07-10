import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/lib/types' // Assuming Database type is defined here or accessible

export const createClient = async (useServiceRole?: boolean) => {
  const cookieStore = await cookies()

  const options: any = { // Use 'any' temporarily to simplify type handling
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options: object }>) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      }
    }
  };

  if (useServiceRole) {
    options.auth = {
      persistSession: false,
    };
    options.global = {
      headers: {
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
    };
    // For service role, cookies are not used for persistence, so provide no-op methods
    options.cookies = {
      getAll() { return []; },
      setAll() { /* no-op */ },
    };
  }

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    useServiceRole ? process.env.SUPABASE_SERVICE_ROLE_KEY! : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    options
  )
}
