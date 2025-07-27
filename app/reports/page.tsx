import { requireRole } from "@/lib/auth"
import { createClient } from "@/utils/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ReportChartsWrapper from './report-charts-wrapper'

export default async function ReportsPage() {
  const session = await requireRole(["admin", "manager"])
  const supabase = await createClient()

  // Fetch financial data by loft
  const { data: lofts, error: loftsError } = await supabase
    .from("lofts")
    .select("*, transactions(*)")

  if (loftsError) {
    throw new Error(loftsError.message)
  }

  const loftRevenue = lofts.map((loft: any) => {
    const revenue = loft.transactions
      .filter((t: any) => t.transaction_type === "income" && t.status === "completed")
      .reduce((acc: number, t: any) => acc + t.amount, 0)
    const expenses = loft.transactions
      .filter((t: any) => t.transaction_type === "expense" && t.status === "completed")
      .reduce((acc: number, t: any) => acc + t.amount, 0)
    return {
      name: loft.name,
      revenue,
      expenses,
      net_profit: revenue - expenses,
    }
  })

  // Fetch monthly revenue trend
  const { data: monthlyRevenue, error: monthlyRevenueError } = await supabase.rpc(
    "calculate_monthly_revenue"
  )

  if (monthlyRevenueError) {
    throw new Error(monthlyRevenueError.message)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Financial Reports</h1>
        <p className="text-muted-foreground">Comprehensive financial analytics and insights</p>
      </div>

      <ReportChartsWrapper loftRevenue={loftRevenue} monthlyRevenue={monthlyRevenue} />
    </div>
  )
}
