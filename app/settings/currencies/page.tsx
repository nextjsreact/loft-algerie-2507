import { getCurrencies, setDefaultCurrency, deleteCurrency } from "../../actions/currencies"
import { CurrencyClient } from "./components/client"

export default async function CurrenciesPage() {
  const currencies = await getCurrencies()

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <CurrencyClient data={currencies} onSetDefault={setDefaultCurrency} onDelete={deleteCurrency} />
    </div>
  )
}
