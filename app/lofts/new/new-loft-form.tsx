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
          title: "Success",
          description: `Loft created (ID: ${result.loftId})`,
          duration: 3000, // Shorter duration for auto-redirect
        })
        router.push("/lofts") // Redirect to the lofts menu
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create loft",
        variant: "destructive",
        duration: 5000,
      })
    }
  }

  return <LoftForm owners={owners} zoneAreas={zoneAreas} internetConnectionTypes={internetConnectionTypes} onSubmit={handleSubmit} />
}
