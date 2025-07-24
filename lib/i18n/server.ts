import { cookies } from 'next/headers'
import { translations, type Language } from './translations'

export async function getTranslations(): Promise<(key: string) => string> {
  const cookieStore = await cookies()
  
  // Try to get language from cookie
  let language = cookieStore.get('language')?.value as Language
  
  // Debug logging
  console.log('Server getTranslations - Cookie language:', language)
  
  // If no language cookie is set, default to Arabic (same as client)
  if (!language || !translations[language]) {
    language = 'ar'
    console.log('Server getTranslations - Using default language:', language)
  }
  
  return (key: string) => {
    const keys = key.split('.')
    let value: any = translations[language]
    
    for (const k of keys) {
      value = value?.[k]
    }
    
    const result = value || key
    console.log(`Server translation - Key: ${key}, Language: ${language}, Result: ${result}`)
    return result
  }
}