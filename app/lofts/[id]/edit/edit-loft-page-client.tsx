"use client"

import { useTranslation } from "@/lib/i18n/context"
import { EditLoftFormWrapper } from "./edit-loft-form-wrapper"

interface EditLoftPageClientProps {
  loft: any
  owners: any[]
  zoneAreas: any[]
  internetConnectionTypes: any[]
}

export function EditLoftPageClient({ loft, owners, zoneAreas, internetConnectionTypes }: EditLoftPageClientProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-6 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">{t('lofts.editLoft')}</h1>
        <p className="text-muted-foreground mt-2">{t('lofts.updatePropertyDetails')}</p>
      </div>
      <EditLoftFormWrapper 
        loft={loft}
        owners={owners} 
        zoneAreas={zoneAreas} 
        internetConnectionTypes={internetConnectionTypes} 
      />
    </div>
  )
}