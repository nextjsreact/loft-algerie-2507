'use client'

import { TransactionForm } from '@/components/forms/transaction-form'
import { createTransaction } from '@/app/actions/transactions'
import { getCategories } from '@/app/actions/categories'
import { getLofts } from '@/app/actions/lofts'
import { getPaymentMethods } from '@/app/actions/payment-methods'
import { Transaction as TransactionFormData } from '@/lib/validations' // Corrected import
import { useState, useEffect } from 'react'
import { Currency, PaymentMethod } from '@/lib/types'

interface Category {
  id: string;
  name: string;
  type: string;
}

interface Loft {
  id: string;
  name: string;
}

export default function NewTransactionPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [lofts, setLofts] = useState<Loft[]>([])
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, loftsData, currenciesData, paymentMethodsData] = await Promise.all([
          getCategories(),
          getLofts(),
          fetch('/api/currencies').then(res => res.json()),
          getPaymentMethods()
        ])
        setCategories(categoriesData)
        setLofts(loftsData)
        setCurrencies(currenciesData)
        setPaymentMethods(paymentMethodsData)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      }
    }
    fetchData()
  }, [])

  const handleCreateTransaction = async (data: TransactionFormData) => {
    setIsSubmitting(true)
    try {
      await createTransaction(data)
    } catch (error) {
      console.error(error)
      // Handle error state in the form
    } finally {
      setIsSubmitting(false)
    }
  }

  return <TransactionForm categories={categories} lofts={lofts} currencies={currencies} paymentMethods={paymentMethods} onSubmit={handleCreateTransaction} isSubmitting={isSubmitting} />
}
