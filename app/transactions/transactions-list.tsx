"use client"

import * as React from "react"
import type { Transaction, Category, Loft, Currency } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/date-picker"
import { Trash } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteTransaction } from "@/app/actions/transactions"

interface TransactionsListProps {
  transactions: (Transaction & { currency_symbol?: string; payment_method_name?: string })[]
  categories: Category[]
  lofts: Loft[]
  currencies: Currency[]
  paymentMethods: { id: string; name: string }[]
  isAdmin: boolean
}

export function TransactionsList({ transactions, categories, lofts, currencies, paymentMethods, isAdmin }: TransactionsListProps) {
  const [startDate, setStartDate] = React.useState<Date | undefined>()
  const [endDate, setEndDate] = React.useState<Date | undefined>()
  const [typeFilter, setTypeFilter] = React.useState<string>("all")
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all")
  const [loftFilter, setLoftFilter] = React.useState<string>("all")
  const [currencyFilter, setCurrencyFilter] = React.useState<string>("all")
  const [paymentMethodFilter, setPaymentMethodFilter] = React.useState<string>("all")
  const [localTransactions, setLocalTransactions] = React.useState(transactions)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteTransaction(id)
      setLocalTransactions(localTransactions.filter(t => t.id !== id))
    } catch (error) {
      console.error("Failed to delete transaction:", error)
    }
  }

  const filteredTransactions = localTransactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date)
    const startDateMatch = !startDate || transactionDate >= startDate
    const endDateMatch = !endDate || transactionDate <= endDate
    const typeMatch = typeFilter === "all" || transaction.transaction_type === typeFilter
    const categoryMatch = categoryFilter === "all" || transaction.category === categoryFilter
    const loftMatch = loftFilter === "all" || transaction.loft_id === loftFilter
    const currencyMatch = currencyFilter === "all" || transaction.currency_id === currencyFilter
    const paymentMethodMatch = paymentMethodFilter === "all" || transaction.payment_method_id === paymentMethodFilter
    return startDateMatch && endDateMatch && typeMatch && categoryMatch && loftMatch && currencyMatch && paymentMethodMatch
  })

  const { totalIncome, totalExpenses, netTotal } = React.useMemo(() => {
    const defaultCurrency = currencies.find(c => c.is_default)
    if (!defaultCurrency) return { totalIncome: 0, totalExpenses: 0, netTotal: 0 }

    return filteredTransactions.reduce(
      (acc, transaction) => {
        const amount = parseFloat(transaction.equivalent_amount_default_currency?.toString() ?? '0');
        if (isNaN(amount)) {
          console.warn("Invalid amount for transaction:", transaction);
          return acc;
        }
        if (transaction.transaction_type === "income") {
          acc.totalIncome += amount;
        } else {
          acc.totalExpenses += amount;
        }
        acc.netTotal = acc.totalIncome - acc.totalExpenses;
        return acc;
      },
      { totalIncome: 0, totalExpenses: 0, netTotal: 0 }
    )
  }, [filteredTransactions, currencies])

  const defaultCurrencySymbol = currencies.find(c => c.is_default)?.symbol || "$"

  return (
    <>
      <div className="mb-6 grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              {totalIncome.toLocaleString("fr-FR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).replace(",", ".")} {defaultCurrencySymbol}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">
              {totalExpenses.toLocaleString("fr-FR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).replace(",", ".")} {defaultCurrencySymbol}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Net Income</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${netTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {netTotal.toLocaleString("fr-FR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).replace(",", ".")} {defaultCurrencySymbol}
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
        <div>
          <Label htmlFor="start-date">Start Date</Label>
          <DatePicker date={startDate} setDate={setStartDate} />
        </div>
        <div>
          <Label htmlFor="end-date">End Date</Label>
          <DatePicker date={endDate} setDate={setEndDate} />
        </div>
        <div>
          <Label htmlFor="type-filter">Type</Label>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger id="type-filter">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="category-filter">Category</Label>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger id="category-filter">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="loft-filter">Loft</Label>
          <Select value={loftFilter} onValueChange={setLoftFilter}>
            <SelectTrigger id="loft-filter">
              <SelectValue placeholder="All Lofts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Lofts</SelectItem>
              {lofts.map((loft) => (
                <SelectItem key={loft.id} value={loft.id}>
                  {loft.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="currency-filter">Currency</Label>
          <Select value={currencyFilter} onValueChange={setCurrencyFilter}>
            <SelectTrigger id="currency-filter">
              <SelectValue placeholder="All Currencies" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Currencies</SelectItem>
              {currencies.map((currency) => (
                <SelectItem key={currency.id} value={currency.id}>
                  {currency.name} ({currency.symbol})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="payment-method-filter">Payment Method</Label>
          <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
            <SelectTrigger id="payment-method-filter">
              <SelectValue placeholder="All Payment Methods" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payment Methods</SelectItem>
              {paymentMethods.map((method) => (
                <SelectItem key={method.id} value={method.id}>
                  {method.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTransactions.map((transaction) => (
          <Card key={transaction.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{transaction.description}</CardTitle>
                  <CardDescription>{new Date(transaction.date).toLocaleDateString()}</CardDescription>
                </div>
                <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Amount:</span>
                <span className={`font-medium ${transaction.transaction_type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.transaction_type === 'income' ? '+' : '-'}{currencies.find(c => c.id === transaction.currency_id)?.symbol || '$'}{new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(transaction.amount)}
                </span>
              </div>
              {transaction.equivalent_amount_default_currency !== null && transaction.equivalent_amount_default_currency !== undefined && transaction.currency_id !== currencies.find(c => c.is_default)?.id && (
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Equivalent:</span>
                  <span className={`text-xs ${transaction.transaction_type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {defaultCurrencySymbol}{new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(transaction.equivalent_amount_default_currency)} (Ratio: {new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8, useGrouping: false }).format(transaction.ratio_at_transaction || 0)})
                  </span>
                </div>
              )}
              {transaction.payment_method_id && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Payment Method:</span>
                  <span className="font-medium">{paymentMethods.find(pm => pm.id === transaction.payment_method_id)?.name}</span>
                </div>
              )}
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/transactions/${transaction.id}`}>View</Link>
                </Button>
                {isAdmin && (
                  <>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/transactions/${transaction.id}/edit`}>Edit</Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the
                            transaction and remove its data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(transaction.id)}>
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredTransactions.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground">
            No transactions match the selected filters.
          </div>
        )}
      </div>
    </>
  )
}
