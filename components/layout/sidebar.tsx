"use client"

import { 
  Building2, Calendar, DollarSign, Home, LogOut, Settings, Users, 
  ClipboardList, UserCheck, ChevronDown, ChevronRight, LayoutDashboard, CreditCard, MessageSquare, Bell
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { User, UserRole } from "@/lib/types"
import { logout } from "@/lib/auth"
import { useState } from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ThemeToggle } from "@/components/theme-toggle"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  user: User;
  unreadCount: number | null;
}

export function Sidebar({ user, unreadCount, className }: SidebarProps) {
  const pathname = usePathname()
  const [isSettingsOpen, setIsSettingsOpen] = useState(pathname.startsWith('/settings'))

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["admin", "manager", "member"] },
    { name: "Conversations", href: "/conversations", icon: MessageSquare, roles: ["admin", "manager", "member"] },
    { name: "Notifications", href: "/notifications", icon: Bell, roles: ["admin", "manager", "member"] },
    { name: "Lofts", href: "/lofts", icon: Building2, roles: ["admin", "manager"] },
    { name: "Tasks", href: "/tasks", icon: ClipboardList, roles: ["admin", "manager", "member"] },
    { name: "Teams", href: "/teams", icon: Users, roles: ["admin", "manager"] },
    { name: "Owners", href: "/owners", icon: UserCheck, roles: ["admin"] },
    { name: "Transactions", href: "/transactions", icon: DollarSign, roles: ["admin", "manager"] },
    { name: "Reports", href: "/reports", icon: Calendar, roles: ["admin", "manager"] },
    { 
      name: "Settings", 
      href: "/settings", 
      icon: Settings, 
      roles: ["admin", "manager", "member"],
      subItems: [
        { name: "Categories", href: "/settings/categories", icon: ClipboardList, roles: ["admin"] },
        { name: "Currencies", href: "/settings/currencies", icon: DollarSign, roles: ["admin"] },
        { name: "Zone Areas", href: "/settings/zone-areas", icon: Home, roles: ["admin"] },
        { name: "Payment Methods", href: "/settings/payment-methods", icon: CreditCard, roles: ["admin"] },
        { name: "Internet Connections", href: "/settings/internet-connections", icon: Building2, roles: ["admin"] },
        { name: "Application", href: "/settings/application", icon: Settings, roles: ["admin"] }
      ]
    },
  ]

  const filteredNavigation = navigation.filter((item) => item.roles.includes(user.role))

  return (
    <div className={cn("flex h-full w-64 flex-col bg-gray-900", className)}>
      <div className="flex h-16 shrink-0 items-center justify-between px-4 border-b border-gray-700">
        <Link href="/dashboard" className="flex items-center group">
          <div className="relative">
            <Building2 className="h-8 w-8 text-white transition-transform group-hover:scale-110" />
            <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-gray-900 bg-blue-500"></div>
          </div>
          <span className="ml-3 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            LoftManager
          </span>
        </Link>
        <div className="hover:bg-gray-800/50 transition-colors rounded-md">
          <ThemeToggle />
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-4">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href || 
                         (item.subItems && item.subItems.some(sub => pathname === sub.href))

          if (item.subItems) {
            return (
              <Collapsible 
                key={item.name}
                open={isSettingsOpen}
                onOpenChange={setIsSettingsOpen}
                className="space-y-1"
              >
                <CollapsibleTrigger className={cn(
                  "w-full flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md",
                  isActive ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
                )}>
                  <div className="flex items-center">
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.name}
                  </div>
                  {isSettingsOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-8 space-y-1">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.name}
                      href={subItem.href}
                      className={cn(
                        "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                        pathname === subItem.href ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      )}
                    >
                      <subItem.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                      {subItem.name}
                    </Link>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            )
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                isActive ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white",
              )}
            >
              <div className="relative">
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {item.name === "Notifications" && unreadCount && unreadCount > 0 && (
                  <div className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></div>
                )}
              </div>
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="flex-shrink-0 p-4 border-t border-gray-700">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors">
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-sm font-bold text-white">{(user.full_name || '').charAt(0).toUpperCase()}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-gray-900 bg-green-500"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user.full_name}</p>
            <p className="text-xs text-gray-300 capitalize">{user.role}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="mt-3 w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors"
          onClick={() => logout()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  )
}
