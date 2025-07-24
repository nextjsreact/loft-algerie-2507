import { createServerClient } from '@supabase/ssr'
import { Database } from '@/lib/types'
import { createClient as createBrowserClient } from './client'

export const createClient = async (useServiceRole?: boolean) => {
  if (typeof window !== 'undefined') {
    return createBrowserClient();
  }

  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();

  const options: any = {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options: object }>) {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options)
        )
      },
    },
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
