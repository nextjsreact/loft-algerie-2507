"use client"

import { useTranslation } from '@/lib/i18n/context'
import { 
  translateTransactionDescription, 
  translateTransactionStatus, 
  translateTransactionType,
  translatePaymentMethod,
  translateCurrency
} from '@/lib/utils/transaction-translator'

interface TranslatedTransactionItemProps {
  transaction: {
    id: string
    description: string
    status: string
    type: string
    amount: number
    currency: string
    payment_method?: string
    date: string
    equivalent?: number
    ratio?: number
  }
  children?: React.ReactNode
}

export function TranslatedTransactionItem({ transaction, children }: TranslatedTransactionItemProps) {
  const { language } = useTranslation()
  
  const translatedDescription = translateTransactionDescription(transaction.description, language)
  const translatedStatus = translateTransactionStatus(transaction.status, language)
  const translatedType = translateTransactionType(transaction.type, language)
  const translatedPaymentMethod = transaction.payment_method 
    ? translatePaymentMethod(transaction.payment_method, language)
    : ''
  const translatedCurrency = translateCurrency(transaction.currency, language)
  
  return (
    <div className="transaction-item">
      <div className="transaction-description">
        {translatedDescription}
      </div>
      <div className="transaction-date">
        {new Date(transaction.date).toLocaleDateString(
          language === 'ar' ? 'ar-DZ' : 
          language === 'fr' ? 'fr-FR' : 'en-US'
        )}
      </div>
      <div className="transaction-status">
        {translatedStatus}
      </div>
      <div className="transaction-amount">
        {transaction.type === 'expense' ? '-' : '+'}
        {translatedCurrency} {transaction.amount.toLocaleString(
          language === 'ar' ? 'ar-DZ' : 
          language === 'fr' ? 'fr-FR' : 'en-US'
        )}
      </div>
      {transaction.equivalent && (
        <div className="transaction-equivalent">
          المعادل: DA {transaction.equivalent.toLocaleString('ar-DZ')} 
          (النسبة: {transaction.ratio})
        </div>
      )}
      {translatedPaymentMethod && (
        <div className="transaction-payment-method">
          طريقة الدفع: {translatedPaymentMethod}
        </div>
      )}
      {children}
    </div>
  )
}