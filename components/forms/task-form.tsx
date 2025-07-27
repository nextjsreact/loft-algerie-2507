'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { taskSchema, taskStatusUpdateSchema, TaskFormData, TaskStatusUpdateData } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import type { Task, User, AuthSession } from '@/lib/types'
import { getSession } from '@/lib/auth'
import { useState, useEffect } from 'react'
import { useTranslation } from '@/lib/i18n/context'

interface TaskFormProps {
  task?: Task
  users: User[]
  onSubmit: (data: TaskFormData | TaskStatusUpdateData) => Promise<void>
  isSubmitting?: boolean
}

export function TaskForm({ task, users, onSubmit, isSubmitting = false }: TaskFormProps) {
  const router = useRouter()
  const [session, setSession] = useState<AuthSession | null>(null)
  const { t } = useTranslation()

  useEffect(() => {
    async function fetchSession() {
      const sessionData = await getSession();
      setSession(sessionData);
    }
    fetchSession();
  }, []);

  // Use different validation schema based on user role
  const isMember = session?.user?.role === 'member'
  const validationSchema = isMember ? taskStatusUpdateSchema : taskSchema
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<TaskFormData | TaskStatusUpdateData>({
    resolver: zodResolver(validationSchema),
    defaultValues: task ? (
      isMember ? {
        status: task.status
      } : {
        ...task,
        description: task.description ?? undefined, // Convert null to undefined
        due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : undefined,
        assigned_to: task.assigned_to ?? 'unassigned', // Convert null to 'unassigned'
      }
    ) : { status: 'todo', due_date: new Date().toISOString().split('T')[0] },
  })

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {task ? (session?.user?.role === 'member' ? t('tasks.form.updateTaskStatus') : t('tasks.form.editTask')) : t('tasks.form.addNewTask')}
        </CardTitle>
        <CardDescription>
          {task ? 
            (session?.user?.role === 'member' ? t('tasks.form.updateStatusDescription') : t('tasks.form.updateTaskInfo')) : 
            t('tasks.form.createNewTask')
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Only show title and description fields for admins and managers */}
          {(session?.user?.role === 'admin' || session?.user?.role === 'manager') && (
            <>
              <div className="space-y-2">
                <Label htmlFor="title">{t('tasks.taskTitle')}</Label>
                <Input id="title" {...register('title')} />
                {'title' in errors && errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t('tasks.taskDescription')}</Label>
                <Textarea id="description" {...register('description')} />
                {'description' in errors && errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
              </div>
            </>
          )}

          {/* Show read-only title and description for members */}
          {session?.user?.role === 'member' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="title">{t('tasks.taskTitle')}</Label>
                <Input id="title" value={task?.title || ''} disabled className="bg-muted" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t('tasks.taskDescription')}</Label>
                <Textarea id="description" value={task?.description || ''} disabled className="bg-muted" />
              </div>
            </>
          )}

          {/* Status field - editable for all roles */}
          <div className="space-y-2">
            <Label htmlFor="status">{t('tasks.taskStatus')}</Label>
            <Select onValueChange={(value) => setValue('status', value as any)} defaultValue={task?.status}>
              <SelectTrigger>
                <SelectValue placeholder={t('common.selectOption')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">{t('tasks.status.todo')}</SelectItem>
                <SelectItem value="in_progress">{t('tasks.status.inProgress')}</SelectItem>
                <SelectItem value="completed">{t('tasks.status.completed')}</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
          </div>

          {/* Due date and assignment - only for admins and managers */}
          {(session?.user?.role === 'admin' || session?.user?.role === 'manager') && (
            <>
              <div className="space-y-2">
                <Label htmlFor="due_date">{t('tasks.taskDueDate')}</Label>
                <Input id="due_date" type="date" {...register('due_date')} />
                {'due_date' in errors && errors.due_date && <p className="text-sm text-red-500">{errors.due_date.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="assigned_to">{t('tasks.assignTo')}</Label>
                <Select onValueChange={(value) => setValue('assigned_to', value === 'unassigned' ? null : value)} defaultValue={task?.assigned_to || 'unassigned'}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('common.selectOption')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">{t('common.none')}</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.full_name} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {'assigned_to' in errors && errors.assigned_to && <p className="text-sm text-red-500">{errors.assigned_to.message}</p>}
              </div>
            </>
          )}

          {/* Read-only due date and assignment for members */}
          {session?.user?.role === 'member' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="due_date_readonly">{t('tasks.taskDueDate')}</Label>
                <Input 
                  id="due_date_readonly" 
                  value={task?.due_date ? new Date(task.due_date).toLocaleDateString() : t('tasks.noDueDate')} 
                  disabled 
                  className="bg-muted" 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assigned_to_readonly">{t('tasks.assignedTo')}</Label>
                <Input 
                  id="assigned_to_readonly" 
                  value={task?.assigned_to ? users.find(u => u.id === task.assigned_to)?.full_name || 'Unknown User' : t('common.none')} 
                  disabled 
                  className="bg-muted" 
                />
              </div>
            </>
          )}

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('tasks.saving') : 
               task ? (session?.user?.role === 'member' ? t('tasks.updateStatus') : t('tasks.updateTask')) : 
               t('tasks.createTask')}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push('/tasks')}>
              {t('tasks.cancel')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
