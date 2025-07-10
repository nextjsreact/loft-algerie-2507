"use client"

import { useState, useEffect } from "react"
import { LoftForm } from "@/components/forms/loft-form"
import { getLoft, updateLoft } from "@/app/actions/lofts"
import { getOwners } from "@/app/actions/owners"
import { getZoneAreas } from "@/app/actions/zone-areas"
import { getInternetConnectionTypes } from "@/app/actions/internet-connections"
import { notFound, redirect, useParams } from "next/navigation"
import { LoftFormData } from "@/lib/validations"
import type { Loft, LoftOwner, ZoneArea, InternetConnectionType } from "@/lib/types"

export default function EditLoftPage() {
  const params = useParams()
  const id = params.id as string

  const [loft, setLoft] = useState<Loft | null>(null)
  const [owners, setOwners] = useState<LoftOwner[]>([])
  const [zoneAreas, setZoneAreas] = useState<ZoneArea[]>([])
  const [internetConnectionTypes, setInternetConnectionTypes] = useState<InternetConnectionType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      try {
        const [loftData, ownersData, zoneAreasData, internetConnectionTypesData] = await Promise.all([
          getLoft(id),
          getOwners(),
          getZoneAreas(),
          getInternetConnectionTypes(),
        ])
        if (!loftData) {
          return notFound()
        }
        setLoft(loftData)
        setOwners(ownersData)
        setZoneAreas(zoneAreasData)
        setInternetConnectionTypes(internetConnectionTypesData)
      } catch (error) {
        console.error("Failed to fetch loft data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!loft) {
    return notFound()
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Edit Loft</h1>
      </div>

      <LoftForm
        loft={loft}
        owners={owners}
        zoneAreas={zoneAreas}
        internetConnectionTypes={internetConnectionTypes}
        onSubmit={(data) => updateLoft(id, data)}
      />
    </div>
  )
}
