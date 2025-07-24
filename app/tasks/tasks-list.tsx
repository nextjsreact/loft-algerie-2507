"use client"

import * as React from "react"
import type { Task, TaskStatus, User } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { DatePicker } from "../../components/ui/date-picker"
import { useTranslation } from "@/lib/i18n/context"

interface TasksListProps {
  tasks: Task[]
  users: User[]
  isAdmin: boolean
  userRole: string
  currentUserId?: string
}

const TASK_STATUSES: TaskStatus[] = ["todo", "in_progress", "completed"]

export function TasksList({ tasks, users, isAdmin, userRole, currentUserId }: TasksListProps) {
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [startDate, setStartDate] = React.useState<Date | undefined>()
  const [endDate, setEndDate] = React.useState<Date | undefined>()
  const { t } = useTranslation()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
      case "in_progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
    }
  }

  const filteredTasks = tasks.filter((task) => {
    const statusMatch = statusFilter === "all" || task.status === statusFilter
    const taskDate = task.due_date ? new Date(task.due_date) : null
    const startDateMatch = !startDate || (taskDate && taskDate >= startDate)
    const endDateMatch = !endDate || (taskDate && taskDate <= endDate)
    return statusMatch && startDateMatch && endDateMatch
  })

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <Label htmlFor="status-filter">{t('tasks.filters.filterByStatus')}</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger id="status-filter">
              <SelectValue placeholder={t('tasks.filters.allStatuses')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('tasks.filters.allStatuses')}</SelectItem>
              {TASK_STATUSES.map((status) => (
                <SelectItem key={status} value={status} className="capitalize">
                  {t(`tasks.status.${status === 'in_progress' ? 'inProgress' : status}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="start-date">{t('tasks.filters.startDate')}</Label>
          <DatePicker date={startDate} setDate={setStartDate} />
        </div>
        <div>
          <Label htmlFor="end-date">{t('tasks.filters.endDate')}</Label>
          <DatePicker date={endDate} setDate={setEndDate} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTasks.map((task) => (
          <Card key={task.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{task.title}</CardTitle>
                  {task.due_date && <CardDescription>{new Date(task.due_date).toLocaleDateString()}</CardDescription>}
                </div>
                <Badge className={getStatusColor(task.status)}>
                  {t(`tasks.status.${task.status === 'in_progress' ? 'inProgress' : task.status}`)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mt-2">{task.description}</p>
              {task.assigned_to && (
                <div className="mt-2 text-sm text-muted-foreground">
                  {t('tasks.assignedTo')}: {users.find(user => user.id === task.assigned_to)?.full_name || 'Unknown User'}
                </div>
              )}
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/tasks/${task.id}`}>{t('tasks.viewTask')}</Link>
                </Button>
                {(isAdmin || (userRole === "manager") || (userRole === "member" && task.assigned_to === currentUserId)) && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/tasks/${task.id}/edit`}>
                      {userRole === "member" ? t('tasks.updateStatus') : t('tasks.editTask')}
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredTasks.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground">
            {t('tasks.noTasks')}
          </div>
        )}
      </div>
    </>
  )
}
