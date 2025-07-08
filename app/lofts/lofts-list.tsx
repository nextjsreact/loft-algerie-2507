"use client"

import * as React from "react"
import type { Loft, LoftOwner, ZoneArea, LoftStatus } from "@/lib/types"
import { deleteLoft } from "@/app/actions/lofts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface LoftsListProps {
  lofts: Loft[]
  owners: LoftOwner[]
  zoneAreas: ZoneArea[]
  isAdmin: boolean
}

const LOFT_STATUSES: LoftStatus[] = ["available", "occupied", "maintenance"]

export function LoftsList({ lofts, owners, zoneAreas, isAdmin }: LoftsListProps) {
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [ownerFilter, setOwnerFilter] = React.useState<string>("all")
  const [zoneAreaFilter, setZoneAreaFilter] = React.useState<string>("all")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      case "occupied":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
    }
  }

  const filteredLofts = lofts.filter((loft) => {
    const statusMatch = statusFilter === "all" || loft.status === statusFilter
    const ownerMatch = ownerFilter === "all" || loft.owner_id === ownerFilter
    const zoneAreaMatch = zoneAreaFilter === "all" || loft.zone_area_id === zoneAreaFilter
    return statusMatch && ownerMatch && zoneAreaMatch
  })

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <Label htmlFor="status-filter">Filter by Status</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger id="status-filter">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {LOFT_STATUSES.map((status) => (
                <SelectItem key={status} value={status} className="capitalize">
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="owner-filter">Filter by Owner</Label>
          <Select value={ownerFilter} onValueChange={setOwnerFilter}>
            <SelectTrigger id="owner-filter">
              <SelectValue placeholder="All Owners" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Owners</SelectItem>
              {owners.map((owner) => (
                <SelectItem key={owner.id} value={owner.id}>
                  {owner.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="zone-area-filter">Filter by Zone Area</Label>
          <Select value={zoneAreaFilter} onValueChange={setZoneAreaFilter}>
            <SelectTrigger id="zone-area-filter">
              <SelectValue placeholder="All Zone Areas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Zone Areas</SelectItem>
              {zoneAreas.map((area) => (
                <SelectItem key={area.id} value={area.id}>
                  {area.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredLofts.map((loft) => (
          <Card key={loft.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{loft.name}</CardTitle>
                  <CardDescription>{loft.address}</CardDescription>
                </div>
                <Badge className={getStatusColor(loft.status)}>{loft.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Monthly Rent:</span>
                  <span className="font-medium">${loft.price_per_month}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Owner:</span>
                  <span className="font-medium">{loft.owner_name || "Unknown"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Zone Area:</span>
                  <span className="font-medium">{loft.zone_area_name || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Company Share:</span>
                  <span className="font-medium">{loft.company_percentage}%</span>
                </div>
                {loft.description && <p className="text-sm text-muted-foreground mt-2">{loft.description}</p>}
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/lofts/${loft.id}`}>View</Link>
                </Button>
                {isAdmin && (
                  <>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/lofts/${loft.id}/edit`}>Edit</Link>
                    </Button>
                    <form
                      action={async () => {
                        if (confirm("Are you sure you want to delete this loft?")) {
                          await deleteLoft(loft.id)
                        }
                      }}
                    >
                      <Button variant="destructive" size="sm" type="submit">
                        Delete
                      </Button>
                    </form>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredLofts.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground">
            No lofts match the selected filters.
          </div>
        )}
      </div>
    </>
  )
}
