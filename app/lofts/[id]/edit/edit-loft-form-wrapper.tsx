"use client"

import { useRouter } from "next/navigation"
import { LoftForm } from "@/components/forms/loft-form"
import { updateLoft } from "@/app/actions/lofts"
import { toast } from "@/components/ui/use-toast"
import { useTranslation } from "@/lib/i18n/context"

export function EditLoftFormWrapper({ loft, owners, zoneAreas, internetConnectionTypes }: any) {
  const router = useRouter()
  const { t } = useTranslation()

  const handleSubmit = async (data: any) => {
    try {
      const result = await updateLoft(loft.id, data)
      if (result?.success) {
        toast({
          title: `✅ ${t('common.success')}`,
          description: `${t('lofts.title')} "${loft.name}" ${t('lofts.updateSuccess')}`,
          duration: 3000,
        })
        setTimeout(() => {
          router.push("/lofts")
        }, 1000)
      } else {
        toast({
          title: `❌ ${t('common.error')}`,
          description: t('lofts.updateError'),
          variant: "destructive",
          duration: 5000,
        })
      }
    } catch (error) {
      console.error('Error updating loft:', error)
      toast({
        title: `❌ ${t('common.error')}`,
        description: t('lofts.updateConnectionError'),
        variant: "destructive",
        duration: 5000,
      })
    }
  }

  return <LoftForm key={loft.id} loft={loft} owners={owners} zoneAreas={zoneAreas} internetConnectionTypes={internetConnectionTypes} onSubmit={handleSubmit} />
}
