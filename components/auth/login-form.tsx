"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { LanguageSelector } from "@/components/ui/language-selector"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { login } from "@/lib/auth"
import { loginSchema, type LoginFormData } from "@/lib/validations"
import { useTranslation } from "@/lib/i18n/context"

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError("")

    try {
      const result = await login(data.email, data.password)
      if (result.success) {
        router.push("/dashboard")
        router.refresh()
      } else {
        setError(result.error || "Login failed")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex justify-between items-center mb-4">
          <div className="flex-1" />
          <LanguageSelector />
        </div>
        <CardTitle className="text-2xl text-center">{t('auth.welcomeBack')}</CardTitle>
        <CardDescription className="text-center">
          {t('auth.signInDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">{t('auth.email')}</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder={t('auth.enterEmail')} 
              {...register("email")} 
              disabled={isLoading} 
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t('auth.password')}</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={t('auth.enterPassword')}
                {...register("password")}
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>

          <div className="flex items-center justify-between">
            <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
              {t('auth.forgotPassword')}
            </Link>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t('auth.signingIn') : t('auth.signIn')}
          </Button>
        </form>

        <Separator />

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {t('auth.noAccount')}{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              {t('auth.signUp')}
            </Link>
          </p>
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <p className="text-sm font-medium mb-2">{t('auth.demoAccounts')}</p>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>
              <strong>{t('auth.admin')}:</strong> admin@loftmanager.com / password123
            </p>
            <p>
              <strong>{t('auth.manager')}:</strong> manager@loftmanager.com / password123
            </p>
            <p>
              <strong>{t('auth.member')}:</strong> member@loftmanager.com / password123
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
