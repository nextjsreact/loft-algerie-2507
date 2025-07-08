import { requireRole } from "@/lib/auth"
import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { linkLoftToAirbnb } from "@/app/actions/lofts"

export default async function LinkAirbnbPage({ params }: { params: { id: string } }) {
  const { id } = params
  await requireRole(["admin"])
  const supabase = await createClient()

  const { data: loft, error } = await supabase
    .from("lofts")
    .select("id, name, airbnb_listing_id")
    .eq("id", id)
    .single()

  if (error || !loft) {
    return notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Link {loft.name} to Airbnb</h1>
        <p className="text-muted-foreground">
          Enter the Airbnb listing ID to link this loft to an Airbnb listing.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Link to Airbnb</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={linkLoftToAirbnb.bind(null, loft.id)}>
            <div className="space-y-2">
              <Label htmlFor="airbnb_listing_id">Airbnb Listing ID</Label>
              <Input
                id="airbnb_listing_id"
                name="airbnb_listing_id"
                defaultValue={loft.airbnb_listing_id || ""}
              />
            </div>
            <div className="mt-4">
              <Button type="submit">Link</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
