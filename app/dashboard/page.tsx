import { requireAuth, getSession } from "@/lib/auth"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { RecentTasks } from "@/components/dashboard/recent-tasks"
import type { Database } from "@/lib/types"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { createClient } from '@/utils/supabase/server' // Import the new createClient

type Task = Database['public']['Tables']['tasks']['Row']
interface RecentTask extends Task {
  assigned_user_name: string | null;
  loft_name: string | null;
  due_date?: Date;
}

export default async function DashboardPage() {
  const session = await requireAuth()
  console.log("DashboardPage: Full session object:", session); // Log full session object
  console.log("DashboardPage: Session received (user ID):", session?.user?.id);
  console.log("DashboardPage: Session received (user email):", session?.user?.email);
  
  if (!session || !session.user) {
    console.error("DashboardPage: No valid session or user found. This should have been redirected by requireAuth.");
    // This case should ideally be handled by requireAuth redirecting,
    // but as a fallback, we can render an error or redirect.
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Access Denied</h1>
        <p className="text-muted-foreground">Please log in to view the dashboard.</p>
      </div>
    );
  }

  const supabase = await createClient() // Create Supabase client for this server component
  console.log("DashboardPage: Supabase client created. Typeof supabase:", typeof supabase);
  console.log("DashboardPage: Supabase client from method:", typeof supabase.from);


  try {
    console.log("DashboardPage: Starting data fetching for Lofts...");
    const { data: loftsData, error: loftsError } = await supabase.from("lofts").select("*")
    if (loftsError) console.error("DashboardPage: Lofts data error:", loftsError);
    else console.log("DashboardPage: Lofts data fetched successfully.");

    const { data: tasksData, error: tasksError } = await supabase.from("tasks").select("id, status").in("status", ["todo", "in_progress"])
    if (tasksError) console.error("DashboardPage: Tasks data error:", tasksError);

    const { data: teamsData, error: teamsError } = await supabase.from("teams").select("id")
    if (teamsError) console.error("DashboardPage: Teams data error:", teamsError);

    const { data: transactionsData, error: transactionsError } = await supabase.from("transactions").select("amount").eq("transaction_type", "income").eq("status", "completed")
    if (transactionsError) console.error("DashboardPage: Transactions data error:", transactionsError);

    const { data: recentTasksData, error: recentTasksError } = await supabase.from("tasks").select("*, assigned_user:profiles(full_name), loft:lofts(name)").order("updated_at", { ascending: false }).limit(5)
    if (recentTasksError) console.error("DashboardPage: Recent tasks data error:", recentTasksError);

    const { data: monthlyRevenueData, error: monthlyRevenueError } = await supabase.rpc('calculate_monthly_revenue')
    if (monthlyRevenueError) console.error("DashboardPage: Monthly revenue data error:", monthlyRevenueError);
    
    // Separate error checks for each data fetch
    if (loftsError) {
      console.error("DashboardPage: Lofts data error:", loftsError);
      throw new Error("Error fetching lofts data");
    }
    if (tasksError) {
      console.error("DashboardPage: Tasks data error:", tasksError);
      throw new Error("Error fetching tasks data");
    }
    if (teamsError) {
      console.error("DashboardPage: Teams data error:", teamsError);
      throw new Error("Error fetching teams data");
    }
    if (transactionsError) {
      console.error("DashboardPage: Transactions data error:", transactionsError);
      throw new Error("Error fetching transactions data");
    }
    if (recentTasksError) {
      console.error("DashboardPage: Recent tasks data error:", recentTasksError);
      throw new Error("Error fetching recent tasks data");
    }
    if (monthlyRevenueError) {
      console.error("DashboardPage: Monthly revenue data error:", monthlyRevenueError);
      throw new Error("Error fetching monthly revenue data");
    }
    console.log("DashboardPage: All data fetched successfully.");

    // Ensure data is an array before processing, even if it's null (which implies RLS or no data)
    const stats = {
      totalLofts: loftsData?.length || 0,
      occupiedLofts: (loftsData || []).filter(l => l.status === 'occupied').length || 0,
      activeTasks: (tasksData || []).length || 0,
      monthlyRevenue: (transactionsData || []).reduce((acc, t) => acc + t.amount, 0) || 0,
      totalTeams: (teamsData || []).length || 0,
    }

    const recentTasks = (recentTasksData || []).map((task: any) => ({
      ...task,
      due_date: task.due_date ? new Date(task.due_date) : undefined,
      assigned_user: task.assigned_user,
      loft: task.loft,
    })) as RecentTask[]

    const monthlyRevenue = (monthlyRevenueData as any) || []

    return (
      <div className="p-4 md:p-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {session.user.full_name || session.user.email || 'User'}</p>
          </div>

          <div>
            <StatsCards stats={stats} />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="lg:col-span-4">
              <RevenueChart monthlyRevenue={monthlyRevenue} />
            </div>
            <div className="lg:col-span-3">
              <RecentTasks tasks={recentTasks} />
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("DashboardPage: Caught error fetching dashboard data:", error);
    return (
      <div className="p-4 md:p-8"> {/* Keep the padding for the error message */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Error loading dashboard data. Please check console for details.</p>
          </div>
          <div className="text-center py-12">
            <p className="text-muted-foreground">Error loading dashboard data. Please try again.</p>
          </div>
        </div>
      </div>
    )
  }
}
