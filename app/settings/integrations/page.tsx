import { requireRole } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function IntegrationsPage() {
  await requireRole(["admin"])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
          <p className="text-muted-foreground">Manage your third-party integrations</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Airbnb</CardTitle>
          <CardDescription>Connect your Airbnb account to sync your lofts and bookings.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/api/auth/airbnb">Connect to Airbnb</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
