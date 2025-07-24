import { translations, Language } from '@/lib/i18n/translations'

/**
 * Fonction utilitaire pour traduire automatiquement les descriptions de transactions
 * et les statuts en fonction de la langue sélectionnée
 */

export function translateTransactionDescription(description: string, language: Language): string {
  const t = translations[language]
  
  // Traduire les descriptions de factures
  if (description.includes('Energy bill payment for')) {
    const loftName = description.replace('Energy bill payment for ', '')
    return `${t.transactions.energyBillPayment} ${loftName}`
  }
  
  if (description.includes('Énergie bill payment for')) {
    const loftName = description.replace('Énergie bill payment for ', '')
    return `${t.transactions.energyBillPayment} ${loftName}`
  }
  
  if (description.includes('Eau bill payment for')) {
    const loftName = description.replace('Eau bill payment for ', '')
    return `${t.transactions.waterBillPayment} ${loftName}`
  }
  
  if (description.includes('Téléphone bill payment for')) {
    const loftName = description.replace('Téléphone bill payment for ', '')
    return `${t.transactions.phoneBillPayment} ${loftName}`
  }
  
  if (description.includes('Location Loft')) {
    const loftName = description.replace('Location ', '')
    return `${t.transactions.rentLocation} ${loftName}`
  }
  
  // Si aucune correspondance, retourner la description originale
  return description
}

export function translateTransactionStatus(status: string, language: Language): string {
  const t = translations[language]
  
  switch (status.toLowerCase()) {
    case 'completed':
      return t.transactions.completed
    case 'pending':
      return t.transactions.pending
    case 'failed':
      return t.transactions.failed
    default:
      return status
  }
}

export function translateTransactionType(type: string, language: Language): string {
  const t = translations[language]
  
  switch (type.toLowerCase()) {
    case 'income':
      return t.transactions.income
    case 'expense':
      return t.transactions.expense
    default:
      return type
  }
}

export function translatePaymentMethod(method: string, language: Language): string {
  const t = translations[language]
  
  // Ajouter des traductions pour les méthodes de paiement courantes
  const paymentMethods: Record<string, Record<Language, string>> = {
    'cash': {
      en: 'Cash',
      fr: 'Espèces',
      ar: 'نقداً'
    },
    'card': {
      en: 'Card',
      fr: 'Carte',
      ar: 'بطاقة'
    },
    'bank_transfer': {
      en: 'Bank Transfer',
      fr: 'Virement Bancaire',
      ar: 'تحويل بنكي'
    },
    'check': {
      en: 'Check',
      fr: 'Chèque',
      ar: 'شيك'
    }
  }
  
  const methodKey = method.toLowerCase().replace(' ', '_')
  return paymentMethods[methodKey]?.[language] || method
}

export function translateCurrency(currency: string, language: Language): string {
  const currencies: Record<string, Record<Language, string>> = {
    'DA': {
      en: 'DA',
      fr: 'DA',
      ar: 'دج'
    },
    'DZD': {
      en: 'DZD',
      fr: 'DZD',
      ar: 'دينار جزائري'
    },
    'EUR': {
      en: 'EUR',
      fr: 'EUR',
      ar: 'يورو'
    },
    'USD': {
      en: 'USD',
      fr: 'USD',
      ar: 'دولار'
    }
  }
  
  return currencies[currency.toUpperCase()]?.[language] || currency
}