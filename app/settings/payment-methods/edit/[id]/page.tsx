import { requireRole } from "@/lib/auth"
import { createClient } from "@/utils/supabase/server"
import { PaymentMethodForm } from "@/components/forms/payment-method-form"
import { updatePaymentMethod } from "@/app/actions/payment-methods"

export default async function EditPaymentMethodPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await requireRole(["admin"])
  const supabase = await createClient()

  const { data: paymentMethod, error } = await supabase
    .from("payment_methods")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching payment method:", error)
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Error</h1>
          <p className="text-muted-foreground">Failed to load payment method data.</p>
        </div>
      </div>
    )
  }

  if (!paymentMethod) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payment Method Not Found</h1>
          <p className="text-muted-foreground">Could not find payment method with ID {id}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Payment Method</h1>
        <p className="text-muted-foreground">Update payment method information</p>
      </div>

      <PaymentMethodForm 
        paymentMethod={paymentMethod}
        action={updatePaymentMethod.bind(null, id)}
      />
    </div>
  )
}
