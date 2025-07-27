import { getCurrencies, createCurrency, updateCurrency } from "@/app/actions/currencies"
import { notFound } from "next/navigation"
import { CurrencyForm } from "./currency-form"
import { Currency } from "@/lib/types"

export default async function NewCurrencyPage({ params }: { params: Promise<{ id?: string }> }) {
  // Await params to ensure it's resolved before accessing properties
  const resolvedParams = await params;
  let currency: Currency | null = null
  if (resolvedParams.id) {
    const currencies = await getCurrencies()
    currency = (currencies.find(c => c.id === resolvedParams.id) as Currency) || null
    if (!currency) {
      notFound()
    }
  }

  return (
    <CurrencyForm initialData={currency} />
  )
}
