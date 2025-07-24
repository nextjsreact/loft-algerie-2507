import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock Supabase
jest.mock('@/utils/supabase/server', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          data: [],
          error: null,
        })),
        in: jest.fn(() => ({
          data: [],
          error: null,
        })),
        order: jest.fn(() => ({
          limit: jest.fn(() => ({
            data: [],
            error: null,
          })),
        })),
      })),
      insert: jest.fn(() => ({
        data: [],
        error: null,
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          data: [],
          error: null,
        })),
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => ({
          data: [],
          error: null,
        })),
      })),
    })),
    auth: {
      getUser: jest.fn(() => ({
        data: { user: null },
        error: null,
      })),
      signInWithPassword: jest.fn(() => ({
        data: { user: null },
        error: null,
      })),
      signUp: jest.fn(() => ({
        data: { user: null },
        error: null,
      })),
      signOut: jest.fn(() => ({
        error: null,
      })),
    },
    rpc: jest.fn(() => ({
      data: [],
      error: null,
    })),
  })),
}))

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'