"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { TasksList } from "./tasks-list"
import { useTranslation } from "@/lib/i18n/context"
import type { Task, User } from "@/lib/types"

interface TasksPageClientProps {
  tasks: Task[]
  users: User[]
  userRole: string
  currentUserId: string
}

export function TasksPageClient({ tasks, users, userRole, currentUserId }: TasksPageClientProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('tasks.title')}</h1>
          <p className="text-muted-foreground">
            {userRole === "member" ? t('tasks.yourTasks') : t('tasks.subtitle')}
          </p>
        </div>
        {(userRole === "admin" || userRole === "manager") && (
          <Button asChild>
            <Link href="/tasks/new">
              <Plus className="mr-2 h-4 w-4" />
              {t('tasks.addTask')}
            </Link>
          </Button>
        )}
      </div>
      <TasksList 
        tasks={tasks} 
        users={users} 
        isAdmin={userRole === "admin"} 
        userRole={userRole}
        currentUserId={currentUserId}
      />
    </div>
  )
}