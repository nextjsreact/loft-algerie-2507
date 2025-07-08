"use client"

import type { LoftOwner } from "@/lib/types"
import { deleteOwner } from "@/app/actions/owners"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin } from "lucide-react"
import Link from "next/link"

interface OwnersListProps {
  owners: (LoftOwner & { loft_count: string; total_monthly_value: string })[]
}

export function OwnersList({ owners }: OwnersListProps) {
  const getOwnershipColor = (type: string) => {
    return type === "company" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100" : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {owners.map((owner) => (
        <Card key={owner.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{owner.name}</CardTitle>
                <CardDescription>
                  {Number.parseInt(owner.loft_count)} properties • $
                  {Number.parseFloat(owner.total_monthly_value).toLocaleString()}/month
                </CardDescription>
              </div>
              <Badge className={getOwnershipColor(owner.ownership_type)}>
                {owner.ownership_type === "company" ? "Company" : "Third Party"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {owner.email && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{owner.email}</span>
                </div>
              )}
              {owner.phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{owner.phone}</span>
                </div>
              )}
              {owner.address && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="line-clamp-2">{owner.address}</span>
                </div>
              )}
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/owners/${owner.id}`}>View</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/owners/${owner.id}/edit`}>Edit</Link>
              </Button>
              <form action={async () => {
                if (confirm("Are you sure you want to delete this owner? This will also delete all their lofts.")) {
                  await deleteOwner(owner.id)
                }
              }}>
                <Button variant="destructive" size="sm" type="submit">
                  Delete
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
