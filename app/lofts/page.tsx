import { requireRole } from "@/lib/auth"
import type { Database } from "@/lib/types" // Import Database type
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { LoftsList } from "./lofts-list"
import { createClient } from '@/utils/supabase/server' // Import the new createClient

type Loft = Database['public']['Tables']['lofts']['Row']
type LoftOwner = Database['public']['Tables']['loft_owners']['Row']
type ZoneArea = Database['public']['Tables']['zone_areas']['Row']

// Define a new type for Loft data with relations
interface LoftWithRelations extends Loft {
  owner_name: string | null;
  zone_area_name: string | null;
}

export default async function LoftsPage() {
  const session = await requireRole(["admin", "manager"])
  const supabase = await createClient()

  try {
    const { data: loftsData, error: loftsError } = await supabase
      .from("lofts")
      .select("*, loft_owners(name), zone_areas!lofts_zone_area_id_fkey(name)")
      .order("created_at", { ascending: false })

    const { data: ownersData, error: ownersError } = await supabase
      .from("loft_owners")
      .select("*")
      .order("name")

    const { data: zoneAreasData, error: zoneAreasError } = await supabase
      .from("zone_areas")
      .select("*")
      .order("name")

    if (loftsError) {
      console.error("Lofts data error (full object):", loftsError); // Log the full error object
      throw new Error(`Error fetching lofts data: ${loftsError.message || JSON.stringify(loftsError)}`); // Include error message in thrown error
    }
    if (ownersError) {
      console.error("Owners data error:", ownersError);
      throw new Error("Error fetching owners data");
    }
    if (zoneAreasError) {
      console.error("Zone Areas data error:", zoneAreasError);
      throw new Error("Error fetching zone areas data");
    }

    // Ensure data is an array before mapping, even if it's null (which implies RLS or no data)
    const lofts: LoftWithRelations[] = (loftsData || []).map((loft: any) => ({
      ...loft,
      owner_name: loft.loft_owners?.name || null, // Extract owner name
      zone_area_name: loft.zone_areas?.name || null, // Extract zone_area name
    }))

    const owners: LoftOwner[] = ownersData || []
    const zoneAreas: ZoneArea[] = zoneAreasData || []

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Lofts</h1>
            <p className="text-muted-foreground">Manage your loft properties</p>
          </div>
          {(session.user.role === "admin" || session.user.role === "manager") && (
            <Button asChild>
              <Link href="/lofts/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Loft
              </Link>
            </Button>
          )}
        </div>
        <LoftsList
          lofts={lofts}
          owners={owners}
          zoneAreas={zoneAreas}
          isAdmin={session.user.role === "admin"}
        />
      </div>
    )
  } catch (error) {
    console.error("Error fetching lofts page data:", error)
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lofts</h1>
          <p className="text-muted-foreground">
            Could not load loft data. Please try again later.
          </p>
        </div>
      </div>
    )
  }
}
