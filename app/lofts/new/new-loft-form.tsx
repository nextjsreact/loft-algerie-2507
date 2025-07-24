"use client"

import { LoftForm } from "@/components/forms/loft-form"
import { createLoft } from "@/app/actions/lofts"
import type { LoftOwner, InternetConnectionType } from "@/lib/types"
import type { ZoneArea } from "@/app/actions/zone-areas"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface NewLoftFormWrapperProps {
  owners: LoftOwner[];
  zoneAreas: ZoneArea[];
  internetConnectionTypes: InternetConnectionType[];
}

export function NewLoftFormWrapper({ owners, zoneAreas, internetConnectionTypes }: NewLoftFormWrapperProps) {
  const router = useRouter()

  const handleSubmit = async (data: any) => {
    try {
      const result = await createLoft(data)
      if (result?.success) {
        toast({
          title: "✅ Success",
          description: `Loft "${data.name}" created successfully`,
          duration: 3000,
        })
        setTimeout(() => {
          router.push("/lofts")
        }, 1000)
      } else {
        toast({
          title: "❌ Error",
          description: "Failed to create loft - please try again",
          variant: "destructive",
          duration: 5000,
        })
      }
    } catch (error) {
      console.error('Error creating loft:', error)
      toast({
        title: "❌ Error",
        description: "Failed to create loft - please check your data and try again",
        variant: "destructive",
        duration: 5000,
      })
    }
  }

  return <LoftForm owners={owners} zoneAreas={zoneAreas} internetConnectionTypes={internetConnectionTypes} onSubmit={handleSubmit} />
}
