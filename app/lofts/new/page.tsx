import { getOwners } from "@/app/actions/owners"
import { getZoneAreas } from "@/app/actions/zone-areas"
import { getInternetConnectionTypes } from "@/app/actions/internet-connections"
import { NewLoftFormWrapper } from "./new-loft-form"
import { getTranslations } from "@/lib/i18n/server"

export default async function NewLoftPage() {
  const owners = await getOwners()
  const zoneAreas = await getZoneAreas()
  const t = await getTranslations()
  
  // Safely get internet connection types with error handling
  let internetConnectionTypes: any[] = []
  try {
    const { data: internetData, error } = await getInternetConnectionTypes()
    if (!error && internetData) {
      internetConnectionTypes = internetData
    }
  } catch (error) {
    console.error('Failed to load internet connection types:', error)
    // Continue with empty array
  }
  
  return (
    <div className="space-y-6 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">{t('lofts.createNewLoft')}</h1>
        <p className="text-muted-foreground mt-2">{t('lofts.addNewPropertyListing')}</p>
      </div>
      <NewLoftFormWrapper 
        owners={owners} 
        zoneAreas={zoneAreas} 
        internetConnectionTypes={internetConnectionTypes} 
      />
    </div>
  )
}
