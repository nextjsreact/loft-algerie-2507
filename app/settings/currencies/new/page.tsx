import { getCurrencies, createCurrency, updateCurrency } from "@/app/actions/currencies"
import { notFound } from "next/navigation"
import { CurrencyForm } from "./currency-form"
import { Currency } from "@/lib/types"

export default async function NewCurrencyPage({
  searchParams,
}: {
  searchParams?: { id?: string }
}) {
  let currency: Currency | undefined

  const id = searchParams?.id

  if (id) {
    const currencies = await getCurrencies()
    currency = currencies.find(c => c.id === id)
    if (!currency) {
      notFound()
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {currency ? "Edit Currency" : "Create Currency"}
      </h1>
      <CurrencyForm
        currency={currency}
        createCurrency={createCurrency}
        updateCurrency={updateCurrency}
      />
    </div>
  )
}
