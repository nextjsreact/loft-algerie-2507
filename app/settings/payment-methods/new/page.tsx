import { PaymentMethodForm } from "@/components/forms/payment-method-form"
import { createPaymentMethod } from "@/app/actions/payment-methods"

export default function NewPaymentMethodPage() {
  return (
    <div className="space-y-6">
      <PaymentMethodForm action={createPaymentMethod} />
    </div>
  )
}
