import { requireAuth } from "@/lib/auth"
import { ErrorBoundary } from "@/components/error-boundary"
import { getDashboardData } from "@/lib/services/dashboard"
import { getMemberDashboardData } from "@/lib/services/member-dashboard"
import { DashboardWrapper, DashboardError } from "@/components/dashboard/dashboard-wrapper"

export default async function DashboardPage() {
  const session = await requireAuth()
  const userName = session.user.full_name || session.user.email || 'User'

  // Check if user is a member (show different dashboard)
  if (session.user.role === 'member') {
    try {
      const { userTasks } = await getMemberDashboardData(session.user.id)
      
      return (
        <ErrorBoundary>
          <DashboardWrapper 
            userRole={session.user.role}
            userName={userName}
            userTasks={userTasks}
          />
        </ErrorBoundary>
      )
    } catch (error) {
      console.error("Member dashboard error:", error)
      return <DashboardError userRole={session.user.role} />
    }
  }

  // Admin/Manager dashboard (original dashboard with full data)
  try {
    const { stats, recentTasks, monthlyRevenue, errors } = await getDashboardData()

    return (
      <ErrorBoundary>
        <DashboardWrapper 
          userRole={session.user.role}
          userName={userName}
          stats={stats}
          recentTasks={recentTasks}
          monthlyRevenue={monthlyRevenue}
          errors={errors}
        />
      </ErrorBoundary>
    )
  } catch (error) {
    console.error("Dashboard error:", error)
    return <DashboardError userRole={session.user.role} />
  }
}
