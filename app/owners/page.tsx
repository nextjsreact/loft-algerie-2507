import { requireRole } from "@/lib/auth"
import { createClient } from "@/utils/supabase/server"
import type { LoftOwner } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { OwnersList } from "./owners-list"

export default async function OwnersPage() {
  const session = await requireRole(["admin"])
  const supabase = await createClient()

  const { data: ownersData, error } = await supabase
    .from("loft_owners")
    .select(
      `
      *,
      lofts (
        id,
        price_per_month
      )
    `
    )
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  const owners = ownersData.map((owner) => {
    const lofts = owner.lofts as unknown as { price_per_month: number }[]
    const loft_count = lofts.length
    const total_monthly_value = lofts.reduce(
      (acc, loft) => acc + loft.price_per_month,
      0
    )
    return {
      ...owner,
      loft_count: String(loft_count),
      total_monthly_value: String(total_monthly_value),
    }
  }) as (LoftOwner & { loft_count: string; total_monthly_value: string })[]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Loft Owners</h1>
          <p className="text-muted-foreground">Manage property owners and partnerships</p>
        </div>
        <Button asChild>
          <Link href="/owners/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Owner
          </Link>
        </Button>
      </div>

      <OwnersList owners={owners} />
    </div>
  )
}
