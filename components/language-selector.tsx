'use client'

import React from 'react'
import { useTranslation } from '@/lib/i18n/context'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Globe } from 'lucide-react'
import { FlagIcon } from '@/components/ui/flag-icon'

export function LanguageSelector() {
  const { language, setLanguage } = useTranslation()

  const languages = [
    { code: 'ar', name: 'العربية', flagCode: 'DZ' as const },
    { code: 'fr', name: 'Français', flagCode: 'FR' as const },
    { code: 'en', name: 'English', flagCode: 'GB' as const },
  ]

  const currentLanguage = languages.find(lang => lang.code === language)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 px-0">
          <FlagIcon country={(currentLanguage || languages[0]).flagCode} className="w-5 h-4" />
          <span className="sr-only">Select language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code as 'ar' | 'fr' | 'en')}
            className={language === lang.code ? 'bg-accent' : ''}
          >
            <FlagIcon country={lang.flagCode} className="w-4 h-3 mr-2" />
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
