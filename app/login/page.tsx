"use client"

import { LoginForm } from "@/components/auth/login-form"
import { useTranslation } from "@/lib/i18n/context"
import { Building2 } from "lucide-react"

export default function LoginPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Building2 className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            {t('landing.title')}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {t('auth.signInDescription')}
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
