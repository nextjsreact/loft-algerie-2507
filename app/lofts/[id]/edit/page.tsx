import { LoftForm } from "@/components/forms/loft-form"
import { getLoft, updateLoft } from "@/app/actions/lofts"
import { getOwners } from "@/app/actions/owners"
import { getZoneAreas } from "@/app/actions/zone-areas" // Import getZoneAreas
import { notFound, redirect } from "next/navigation"

export default async function EditLoftPage({ params }: { params: { id: string } }) {
  const { id } = params // Destructure id from params
  const [loft, owners, zoneAreas] = await Promise.all([ // Fetch zoneAreas
    getLoft(id), // Use the destructured id
    getOwners(),
    getZoneAreas() // Fetch zone areas
  ])

  if (!loft) {
    return notFound()
  }

  async function handleUpdate(data: {
    address: string
    name: string
    status: "available" | "occupied" | "maintenance"
    price_per_month: number
    owner_id: string
    company_percentage: number
    owner_percentage: number
    description?: string
    zone_area_id?: string | null; // Add zone_area_id
  }) {
    "use server"
    try {
      await updateLoft(id, data) // Use the destructured id
      redirect(`/lofts/${id}`) // Use the destructured id
    } catch (error) {
      console.error("Failed to update loft:", error)
      throw error
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Edit Loft</h1>
      </div>

      <LoftForm
        loft={loft}
        owners={owners}
        zoneAreas={zoneAreas} // Pass zoneAreas
        onSubmit={handleUpdate}
      />
    </div>
  )
}
