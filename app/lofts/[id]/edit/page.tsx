import { getOwners } from "@/app/actions/owners"
import { getZoneAreas } from "@/app/actions/zone-areas"
import { getInternetConnectionTypes } from "@/app/actions/internet-connections"
import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import { EditLoftFormWrapper } from "./edit-loft-form-wrapper"
import { EditLoftPageClient } from "./edit-loft-page-client"

export default async function EditLoftPage({ params }: { params: { id: string } }) {
  const awaitedParams = await params;
  const supabase = await createClient()

  const { data: loft, error } = await supabase
    .from("lofts")
    .select("*")
    .eq("id", awaitedParams.id)
    .single()

  if (error || !loft) {
    notFound()
  }

  const owners = await getOwners()
  const zoneAreas = await getZoneAreas()
  const { data: internetConnectionTypesData, error: internetConnectionTypesError } = await getInternetConnectionTypes()

  if (internetConnectionTypesError) {
    console.error('Failed to load internet connection types:', internetConnectionTypesError)
  }
  
  const internetConnectionTypes = internetConnectionTypesData || []

  return (
    <EditLoftPageClient 
      loft={loft}
      owners={owners} 
      zoneAreas={zoneAreas} 
      internetConnectionTypes={internetConnectionTypes} 
    />
  )
}
