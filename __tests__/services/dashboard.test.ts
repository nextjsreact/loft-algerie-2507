import { getDashboardData } from '@/lib/services/dashboard'
import { createClient } from '@/utils/supabase/server'

// Mock the createClient function
jest.mock('@/utils/supabase/server')
const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>

describe('Dashboard Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch dashboard data successfully', async () => {
    const mockSupabase = {
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({ data: [], error: null })),
          in: jest.fn(() => ({ data: [], error: null })),
          order: jest.fn(() => ({
            limit: jest.fn(() => ({ data: [], error: null })),
          })),
          gte: jest.fn(() => ({ data: [], error: null })),
        })),
      })),
      rpc: jest.fn(() => ({ data: [], error: null })),
    }

    mockCreateClient.mockResolvedValue(mockSupabase as any)

    const result = await getDashboardData()

    expect(result).toHaveProperty('stats')
    expect(result).toHaveProperty('recentTasks')
    expect(result).toHaveProperty('monthlyRevenue')
    expect(result).toHaveProperty('errors')
    expect(result.stats).toHaveProperty('totalLofts')
    expect(result.stats).toHaveProperty('occupiedLofts')
    expect(result.stats).toHaveProperty('activeTasks')
    expect(result.stats).toHaveProperty('monthlyRevenue')
    expect(result.stats).toHaveProperty('totalTeams')
  })

  it('should handle database errors gracefully', async () => {
    const mockSupabase = {
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({ data: null, error: { message: 'Database error' } })),
          in: jest.fn(() => ({ data: null, error: { message: 'Database error' } })),
          order: jest.fn(() => ({
            limit: jest.fn(() => ({ data: null, error: { message: 'Database error' } })),
          })),
          gte: jest.fn(() => ({ data: null, error: { message: 'Database error' } })),
        })),
      })),
      rpc: jest.fn(() => ({ data: null, error: { message: 'Database error' } })),
    }

    mockCreateClient.mockResolvedValue(mockSupabase as any)

    const result = await getDashboardData()

    expect(result.errors.length).toBeGreaterThan(0)
    expect(result.stats.totalLofts).toBe(0)
    expect(result.stats.occupiedLofts).toBe(0)
  })

  it('should calculate stats correctly with sample data', async () => {
    const mockLoftsData = [
      { id: '1', status: 'occupied', price_per_month: 1000 },
      { id: '2', status: 'available', price_per_month: 1200 },
      { id: '3', status: 'occupied', price_per_month: 900 },
    ]

    const mockTasksData = [
      { id: '1', status: 'todo' },
      { id: '2', status: 'in_progress' },
    ]

    const mockTransactionsData = [
      { amount: 1000 },
      { amount: 900 },
    ]

    const mockSupabase = {
      from: jest.fn((table: string) => {
        const mockQueries = {
          select: jest.fn(() => ({
            eq: jest.fn(() => ({ data: mockTransactionsData, error: null })),
            in: jest.fn(() => ({ data: mockTasksData, error: null })),
            order: jest.fn(() => ({
              limit: jest.fn(() => ({ data: [], error: null })),
            })),
            gte: jest.fn(() => ({ data: mockTransactionsData, error: null })),
          })),
        }

        if (table === 'lofts') {
          mockQueries.select = jest.fn(() => ({
            eq: jest.fn(() => ({ data: [], error: null })),
            in: jest.fn(() => ({ data: [], error: null })),
            order: jest.fn(() => ({
              limit: jest.fn(() => ({ data: [], error: null }))
            })),
            gte: jest.fn(() => ({ data: [], error: null }))
          }))
        }

        return mockQueries
      }),
      rpc: jest.fn(() => ({ data: [], error: null })),
    }

    mockCreateClient.mockResolvedValue(mockSupabase as any)

    const result = await getDashboardData()

    expect(result.stats.totalLofts).toBe(3)
    expect(result.stats.occupiedLofts).toBe(2)
    expect(result.stats.activeTasks).toBe(2)
    expect(result.stats.monthlyRevenue).toBe(1900)
  })
})