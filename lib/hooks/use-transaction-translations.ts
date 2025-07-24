"use client"

import { useTranslation } from '@/lib/i18n/context'
import { 
  translateTransactionDescription, 
  translateTransactionStatus, 
  translateTransactionType,
  translatePaymentMethod,
  translateCurrency
} from '@/lib/utils/transaction-translator'

export function useTransactionTranslations() {
  const { language } = useTranslation()
  
  return {
    translateDescription: (description: string) => 
      translateTransactionDescription(description, language),
    
    translateStatus: (status: string) => 
      translateTransactionStatus(status, language),
    
    translateType: (type: string) => 
      translateTransactionType(type, language),
    
    translatePaymentMethod: (method: string) => 
      translatePaymentMethod(method, language),
    
    translateCurrency: (currency: string) => 
      translateCurrency(currency, language),
    
    formatAmount: (amount: number, currency: string, type: 'income' | 'expense') => {
      const translatedCurrency = translateCurrency(currency, language)
      const sign = type === 'expense' ? '-' : '+'
      const formattedAmount = amount.toLocaleString(
        language === 'ar' ? 'ar-DZ' : 
        language === 'fr' ? 'fr-FR' : 'en-US'
      )
      return `${sign}${translatedCurrency}${formattedAmount}`
    },
    
    formatDate: (date: string) => {
      return new Date(date).toLocaleDateString(
        language === 'ar' ? 'ar-DZ' : 
        language === 'fr' ? 'fr-FR' : 'en-US'
      )
    }
  }
}