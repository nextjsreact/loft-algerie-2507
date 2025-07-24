'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { translations, Language } from './translations'

interface I18nContextType {
  t: (key: string) => string
  language: Language
  setLanguage: (lang: Language) => void
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

interface I18nProviderProps {
  children: ReactNode
  initialLanguage?: Language
}

export function I18nProvider({ children, initialLanguage = 'ar' }: I18nProviderProps) {
  // Always start with initialLanguage to avoid hydration mismatch
  const [language, setLanguageState] = React.useState<Language>(initialLanguage)
  const [isHydrated, setIsHydrated] = React.useState(false)

  // Hydrate with cookie value after initial render
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = document.cookie
        .split('; ')
        .find(row => row.startsWith('language='))
        ?.split('=')[1] as Language
      
      if (savedLanguage && translations[savedLanguage] && savedLanguage !== language) {
        setLanguageState(savedLanguage)
      }
      setIsHydrated(true)
    }
  }, [])

  // Save initial language to cookie if not already set
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('language='))
      
      if (!currentCookie) {
        document.cookie = `language=${language}; path=/; max-age=${60 * 60 * 24 * 365}` // 1 year
      }
    }
  }, [language])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    // Save to cookie immediately
    if (typeof window !== 'undefined') {
      document.cookie = `language=${lang}; path=/; max-age=${60 * 60 * 24 * 365}` // 1 year
      // Force page reload to update server-side translations
      window.location.reload()
    }
  }

  const t = (key: string): string => {
    const keys = key.split('.')
    let result: any = translations[language]
    
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k]
      } else {
        // Fallback to English if key not found
        result = translations.en
        for (const fallbackKey of keys) {
          if (result && typeof result === 'object' && fallbackKey in result) {
            result = result[fallbackKey]
          } else {
            return key // Return key as fallback
          }
        }
        return result || key
      }
    }
    
    return result || key
  }

  return (
    <I18nContext.Provider value={{ t, language, setLanguage }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useTranslation must be used within I18nProvider')
  }
  return context
}
