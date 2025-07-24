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
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { register as registerUser } from "@/lib/auth"
import { registerSchema, type RegisterFormData } from "@/lib/validations"
import { useTranslation } from "@/lib/i18n/context"

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setError("")

    try {
      const result = await registerUser(data.email, data.password, data.full_name)
      if (result.success) {
        router.push("/dashboard")
        router.refresh()
      } else {
        setError(result.error || t('auth.registrationFailed'))
      }
    } catch (err) {
      setError(t('auth.unexpectedError'))
    } finally {
      setIsLoading(false)
    }
  }

  console.log("Form errors:", errors); // Added to debug validation
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">{t('auth.signUpTitle')}</CardTitle>
        <CardDescription className="text-center">{t('auth.signUpDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="full_name">{t('auth.fullName')}</Label>
            <Input id="full_name" placeholder={t('auth.enterFullName')} {...register("full_name")} disabled={isLoading} />
            {errors.full_name && <p className="text-sm text-red-500">{errors.full_name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t('auth.email')}</Label>
            <Input id="email" type="email" placeholder={t('auth.enterEmail')} {...register("email")} disabled={isLoading} />
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

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t('auth.signingUp') : t('auth.signUp')}
          </Button>
        </form>

        <Separator />

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {t('auth.haveAccount')}{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              {t('auth.signIn')}
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
