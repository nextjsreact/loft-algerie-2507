import { requireRole } from "@/lib/auth"
import { getTransactions } from "@/app/actions/transactions"
import { getCategories } from "@/app/actions/categories"
import { getAllLofts } from "@/app/actions/auth"
import { getCurrencies } from "@/app/actions/currencies"
import { getPaymentMethods } from "@/app/actions/payment-methods"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { TransactionsList } from "./transactions-list"

export default async function TransactionsPage() {
  const session = await requireRole(["admin", "manager"])
  const transactions = await getTransactions()
  const categories = await getCategories()
  const lofts = await getAllLofts()
  const currencies = await getCurrencies()
  const paymentMethods = await getPaymentMethods()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">Manage your financial transactions</p>
        </div>
        {session.user.role === "admin" && (
          <Button asChild>
            <Link href="/transactions/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Transaction
            </Link>
          </Button>
        )}
      </div>
      <TransactionsList
        transactions={transactions}
        categories={categories}
        lofts={lofts || []}
        currencies={currencies}
        paymentMethods={paymentMethods}
        isAdmin={session.user.role === "admin"}
      />
    </div>
  )
}
