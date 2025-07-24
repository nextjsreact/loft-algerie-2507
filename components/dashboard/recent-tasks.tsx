"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import type { Task as BaseTask } from "@/lib/types" // Import BaseTask from lib/types
import { useTranslation } from "@/lib/i18n/context"

interface DisplayTask extends BaseTask {
  assigned_user?: { full_name: string } | null;
  loft?: { name: string } | null;
  due_date?: Date; // Ensure due_date is a Date object for display
}

interface RecentTasksProps {
  tasks: DisplayTask[]
}

export function RecentTasks({ tasks }: RecentTasksProps) {
  const { t } = useTranslation()
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      case "in_progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      case "todo":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboard.recentTasks')}</CardTitle>
        <CardDescription>{t('dashboard.latestTaskUpdates')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{task.title}</p>
                <p className="text-sm text-muted-foreground">
                  {task.loft?.name} • {task.assigned_user?.full_name}
                </p>
                {task.due_date && (
                  <p className="text-xs text-muted-foreground">{t('dashboard.due')}: {format(new Date(task.due_date), "d MMM yyyy")}</p>
                )}
              </div>
              <Badge className={getStatusColor(task.status)}>
                {task.status === 'todo' ? t('dashboard.toDo') : 
                 task.status === 'in_progress' ? t('dashboard.inProgress') : 
                 task.status === 'completed' ? t('dashboard.completed') : task.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
