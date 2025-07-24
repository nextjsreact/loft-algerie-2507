'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { transactionSchema } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import type { Currency, Transaction } from '@/lib/types'
import { Transaction as TransactionFormData } from '@/lib/validations'
import { useTranslation } from '@/lib/i18n/context'

interface Category {
  id: string;
  name: string;
  type: string;
}

interface Loft {
  id: string;
  name: string;
}

interface PaymentMethod {
  id: string;
  name: string;
}

interface TransactionFormProps {
  transaction?: Transaction
  categories: Category[]
  lofts: Loft[]
  currencies: Currency[]
  paymentMethods: PaymentMethod[]
  onSubmit: (data: TransactionFormData) => Promise<void>
  isSubmitting?: boolean
}

export function TransactionForm({ transaction, categories, lofts, currencies, paymentMethods, onSubmit, isSubmitting = false }: TransactionFormProps) {
  const router = useRouter()
  const { t } = useTranslation()
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      ...transaction, // Spread existing transaction properties
      // Format date to YYYY-MM-DD string for HTML date input
      date: transaction?.date ? transaction.date.split('T')[0] : new Date().toISOString().split('T')[0],
      loft_id: transaction?.loft_id || '', // Ensure it's a string
      currency_id: transaction?.currency_id || '', // Ensure it's a string
      payment_method_id: transaction?.payment_method_id || '', // Ensure it's a string
      // Set default status and type for new transactions if not provided
      status: transaction?.status || 'pending',
      transaction_type: transaction?.transaction_type || 'income',
      amount: transaction?.amount || 0,
      description: transaction?.description || '',
      category: transaction?.category || '',
    },
  })

  const transactionType = watch("transaction_type")
  const filteredCategories = categories.filter(c => c.type === transactionType)

  const [convertedAmount, setConvertedAmount] = useState<number | null>(null)
  const amount = watch("amount")
  const currencyId = watch("currency_id")

  useEffect(() => {
    const selectedCurrency = currencies.find(c => c.id === currencyId)
    const defaultCurrency = currencies.find(c => c.is_default)

    console.log("TransactionForm Debug:")
    console.log("  amount:", amount)
    console.log("  currencyId:", currencyId)
    console.log("  currencies:", currencies)
    console.log("  selectedCurrency:", selectedCurrency)
    console.log("  defaultCurrency:", defaultCurrency)

    if (amount && selectedCurrency && defaultCurrency && selectedCurrency.id !== defaultCurrency.id) {
      const converted = (amount * (selectedCurrency.ratio || 1)) / (defaultCurrency.ratio || 1);
      setConvertedAmount(converted)
    console.log("  convertedAmount:", converted)
  } else {
    setConvertedAmount(null)
    console.log("  convertedAmount set to null")
  }
}, [amount, currencyId, currencies])


return (
  <Card className="max-w-2xl mx-auto">
    <CardHeader>
      <CardTitle>{transaction ? t('transactions.editTransaction') : t('transactions.addNewTransaction')}</CardTitle>
      <CardDescription>{transaction ? t('transactions.updateTransactionInfo') : t('transactions.createNewTransaction')}</CardDescription>
    </CardHeader>
    <CardContent>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="amount">{t('transactions.amount')}</Label>
            <Input id="amount" type="number" step="0.01" {...register('amount', { valueAsNumber: true })} />
            {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
            {amount !== null && amount !== undefined && (
              <p className="text-sm text-muted-foreground">
                Selected Currency: {currencies.find(c => c.id === currencyId)?.symbol || ''}{new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)}
              </p>
            )}
            {currencyId && currencies.find(c => c.id === currencyId) && (
              <p className="text-sm text-muted-foreground">
                Ratio: {new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8, useGrouping: false }).format((currencies.find(c => c.id === currencyId)?.ratio || 1) / (currencies.find(c => c.is_default)?.ratio || 1))}
              </p>
            )}
            {convertedAmount !== null && (
              <p className="text-sm text-muted-foreground">
                Equivalent in {currencies.find(c => c.is_default)?.symbol || 'Default'}: {new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(convertedAmount)}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">{t('transactions.date')}</Label>
            <Input id="date" type="date" {...register('date')} />
            {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
          </div>
        </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('transactions.description')}</Label>
            <Textarea id="description" {...register('description')} />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="transaction_type">{t('transactions.type')}</Label>
              <Select onValueChange={(value) => setValue('transaction_type', value as any)} defaultValue={transaction?.transaction_type}>
                <SelectTrigger>
                  <SelectValue placeholder={t('common.selectOption')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">{t('transactions.income')}</SelectItem>
                  <SelectItem value="expense">{t('transactions.expense')}</SelectItem>
                </SelectContent>
              </Select>
              {errors.transaction_type && <p className="text-sm text-red-500">{errors.transaction_type.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">{t('transactions.status')}</Label>
              <Select onValueChange={(value) => setValue('status', value as any)} defaultValue={transaction?.status}>
                <SelectTrigger>
                  <SelectValue placeholder={t('common.selectOption')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">{t('transactions.pending')}</SelectItem>
                  <SelectItem value="completed">{t('transactions.completed')}</SelectItem>
                  <SelectItem value="failed">{t('transactions.failed')}</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">{t('transactions.category')}</Label>
              <Select onValueChange={(value) => setValue('category', value)} defaultValue={transaction?.category || ''}>
                <SelectTrigger>
                  <SelectValue placeholder={t('common.selectOption')} />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.map(category => (
                    <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="loft">{t('transactions.loft')} ({t('transactions.optional')})</Label>
              <Select onValueChange={(value) => setValue('loft_id', value)} defaultValue={transaction?.loft_id || ''}>
                <SelectTrigger>
                  <SelectValue placeholder={t('common.selectOption')} />
                </SelectTrigger>
                <SelectContent>
                  {(lofts || []).map(loft => (
                    <SelectItem key={loft.id} value={loft.id}>{loft.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.loft_id && <p className="text-sm text-red-500">{errors.loft_id.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency_id">{t('transactions.currency')} ({t('transactions.optional')})</Label>
            <Select onValueChange={(value) => setValue('currency_id', value)} defaultValue={transaction?.currency_id || ''}> {/* Ensure default is empty string */}
              <SelectTrigger>
                <SelectValue placeholder={t('common.selectOption')} />
              </SelectTrigger>
              <SelectContent>
                {currencies.map(currency => (
                  <SelectItem key={currency.id} value={currency.id}>{currency.name} ({currency.symbol})</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.currency_id && <p className="text-sm text-red-500">{errors.currency_id.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment_method_id">{t('transactions.paymentMethod')} ({t('transactions.optional')})</Label>
            <Select onValueChange={(value) => setValue('payment_method_id', value)} defaultValue={transaction?.payment_method_id || ''}>
              <SelectTrigger>
                <SelectValue placeholder={t('common.selectOption')} />
              </SelectTrigger>
              <SelectContent>
                {(paymentMethods || []).map(method => (
                  <SelectItem key={method.id} value={method.id}>{method.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.payment_method_id && <p className="text-sm text-red-500">{errors.payment_method_id.message}</p>}
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('common.saving') : transaction ? t('transactions.updateTransaction') : t('transactions.createTransaction')}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push('/transactions')}>
              {t('common.cancel')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
