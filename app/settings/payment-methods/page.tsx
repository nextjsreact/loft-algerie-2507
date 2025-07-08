import { requireRole } from "@/lib/auth"
import { getPaymentMethods } from "@/app/actions/payment-methods"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function PaymentMethodsPage() {
  await requireRole(["admin"])
  const paymentMethods = await getPaymentMethods()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payment Methods</h1>
          <p className="text-muted-foreground">Manage your payment methods</p>
        </div>
        <Button asChild>
          <Link href="/settings/payment-methods/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Payment Method
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Existing Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Payment methods list will go here */}
          {paymentMethods.length === 0 ? (
            <p className="text-muted-foreground">No payment methods found.</p>
          ) : (
            <ul>
              {paymentMethods.map((method) => (
                <li key={method.id} className="flex justify-between items-center py-2 border-b">
                  <span>{method.name} ({method.type})</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/settings/payment-methods/edit/${method.id}`}>Edit</Link>
                    </Button>
                    {/* Delete button will go here */}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
