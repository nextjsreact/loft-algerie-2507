"use client"

import * as React from "react"
import { useTranslation } from "@/lib/i18n/context"
import { useTransactionTranslations } from "@/lib/hooks/use-transaction-translations"
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
  const { t } = useTranslation()
  const { translateDescription, translateStatus, translatePaymentMethod, formatDate } = useTransactionTranslations()
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
            <CardTitle>{t('transactions.totalIncome')}</CardTitle>
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
            <CardTitle>{t('transactions.totalExpenses')}</CardTitle>
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
            <CardTitle>{t('transactions.netIncome')}</CardTitle>
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
          <Label htmlFor="start-date">{t('transactions.startDate')}</Label>
          <DatePicker date={startDate} setDate={setStartDate} />
        </div>
        <div>
          <Label htmlFor="end-date">{t('transactions.endDate')}</Label>
          <DatePicker date={endDate} setDate={setEndDate} />
        </div>
        <div>
          <Label htmlFor="type-filter">{t('transactions.type')}</Label>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger id="type-filter">
              <SelectValue placeholder={t('transactions.allTypes')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('transactions.allTypes')}</SelectItem>
              <SelectItem value="income">{t('transactions.income')}</SelectItem>
              <SelectItem value="expense">{t('transactions.expense')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="category-filter">{t('transactions.category')}</Label>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger id="category-filter">
              <SelectValue placeholder={t('transactions.allCategories')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('transactions.allCategories')}</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="loft-filter">{t('transactions.loft')}</Label>
          <Select value={loftFilter} onValueChange={setLoftFilter}>
            <SelectTrigger id="loft-filter">
              <SelectValue placeholder={t('transactions.allLofts')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('transactions.allLofts')}</SelectItem>
              {lofts.map((loft) => (
                <SelectItem key={loft.id} value={loft.id}>
                  {loft.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="currency-filter">{t('transactions.currency')}</Label>
          <Select value={currencyFilter} onValueChange={setCurrencyFilter}>
            <SelectTrigger id="currency-filter">
              <SelectValue placeholder={t('transactions.allCurrencies')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('transactions.allCurrencies')}</SelectItem>
              {currencies.map((currency) => (
                <SelectItem key={currency.id} value={currency.id}>
                  {currency.name} ({currency.symbol})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="payment-method-filter">{t('transactions.paymentMethod')}</Label>
          <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
            <SelectTrigger id="payment-method-filter">
              <SelectValue placeholder={t('transactions.allPaymentMethods')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('transactions.allPaymentMethods')}</SelectItem>
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
                  <CardTitle className="text-lg">{translateDescription(transaction.description)}</CardTitle>
                  <CardDescription>{formatDate(transaction.date)}</CardDescription>
                </div>
                <Badge className={getStatusColor(transaction.status)}>{translateStatus(transaction.status)}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">{t('transactions.amount')}:</span>
                <span className={`font-medium ${transaction.transaction_type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.transaction_type === 'income' ? '+' : '-'}{currencies.find(c => c.id === transaction.currency_id)?.symbol || '$'}{new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(transaction.amount)}
                </span>
              </div>
              {transaction.equivalent_amount_default_currency !== null && transaction.equivalent_amount_default_currency !== undefined && transaction.currency_id !== currencies.find(c => c.is_default)?.id && (
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">{t('transactions.equivalent')}:</span>
                  <span className={`text-xs ${transaction.transaction_type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {defaultCurrencySymbol}{new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(transaction.equivalent_amount_default_currency)} ({t('transactions.ratio')}: {new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8, useGrouping: false }).format(transaction.ratio_at_transaction || 0)})
                  </span>
                </div>
              )}
              {transaction.payment_method_id && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t('transactions.paymentMethod')}:</span>
                  <span className="font-medium">{translatePaymentMethod(paymentMethods.find(pm => pm.id === transaction.payment_method_id)?.name || '')}</span>
                </div>
              )}
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/transactions/${transaction.id}`}>{t('common.view')}</Link>
                </Button>
                {isAdmin && (
                  <>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/transactions/${transaction.id}/edit`}>{t('common.edit')}</Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t('transactions.deleteConfirmTitle')}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {t('transactions.deleteConfirmDescription')}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(transaction.id)}>
                            {t('transactions.continue')}
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
            {t('transactions.noTransactions')}
          </div>
        )}
      </div>
    </>
  )
}
