"use client"

import React from 'react';
import { useTranslation } from '@/lib/i18n/context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Languages, Globe } from 'lucide-react';
import { Language } from '@/lib/i18n/translations';
import { FlagIcon } from './flag-icon';

const languages = [
  { code: 'en' as Language, name: 'English', flagCode: 'US' as const },
  { code: 'fr' as Language, name: 'Français', flagCode: 'FR' as const },
  { code: 'ar' as Language, name: 'العربية', flagCode: 'DZ' as const },
];

interface LanguageSelectorProps {
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showText?: boolean;
  className?: string;
}

export function LanguageSelector({ 
  variant = 'ghost', 
  size = 'icon',
  showText = false,
  className = ""
}: LanguageSelectorProps) {
  const { language, setLanguage, t } = useTranslation();
  
  // Always find a language, fallback to Arabic if not found
  const currentLanguage = languages.find(lang => lang.code === language) || languages.find(lang => lang.code === 'ar');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={`${showText ? "gap-2" : ""} ${className}`}>
          <FlagIcon country={currentLanguage?.flagCode || 'DZ'} className="w-5 h-4" />
          {showText && (
            <span className="ml-2">
              {currentLanguage?.name || 'العربية'}
            </span>
          )}
          {showText && <Languages className="h-4 w-4 ml-1" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36 z-50">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`flex items-center gap-2 ${
              language === lang.code ? 'bg-accent' : ''
            }`}
          >
            <FlagIcon country={lang.flagCode} className="w-4 h-3" />
            <span>{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}