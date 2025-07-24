import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { getSession } from "@/lib/auth"
import { getUnreadNotificationsCount } from "@/app/actions/notifications"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { ToastProvider } from '@/components/providers/toast-provider'
import { EnhancedRealtimeProvider } from '@/components/providers/enhanced-realtime-provider'
import { NotificationProvider } from '@/components/providers/notification-context'
import { CriticalAlertsNotification } from '@/components/executive/critical-alerts-notification'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Loft Management System",
  description: "Professional SaaS platform for managing loft properties",
}

import { ThemeProvider } from "@/components/theme-provider"
import { I18nProvider } from "@/lib/i18n/context"

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession(); // Fetch session in the root layout
  const { count: unreadCount } = session ? await getUnreadNotificationsCount(session.user.id) : { count: null };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <I18nProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          <ToastProvider />
          {session ? ( // Render full layout with sidebar/header if session exists
            <EnhancedRealtimeProvider userId={session.user.id}>
              <NotificationProvider userId={session.user.id}>
                <div className="flex h-screen bg-background md:gap-x-4">
                  <div className="hidden md:flex">
                    <Sidebar user={session.user} unreadCount={unreadCount} />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <Header user={session.user} />
                    <main className="flex-1 overflow-y-auto">
                      {children}
                    </main>
                  </div>
                  {/* Notifications d'alertes critiques pour les executives */}
                  <CriticalAlertsNotification 
                    userId={session.user.id} 
                    userRole={session.user.role} 
                  />
                </div>
              </NotificationProvider>
            </EnhancedRealtimeProvider>
          ) : ( // Render children directly (e.g., login page) if no session
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          )}
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  )
}
