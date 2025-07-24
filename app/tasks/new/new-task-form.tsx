'use client'

import { TaskForm } from '@/components/forms/task-form'
import { createTask } from '@/app/actions/tasks'
import { TaskFormData } from '@/lib/validations'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'
import { useTranslation } from '@/lib/i18n/context'
import type { User } from '@/lib/types'

interface NewTaskFormProps {
  users: User[]
}

export default function NewTaskForm({ users }: NewTaskFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { t } = useTranslation()

  const handleCreateTask = async (data: TaskFormData) => {
    setIsSubmitting(true)
    try {
      await createTask(data)
      toast({
        title: `✅ ${t('common.success')}`,
        description: `${t('tasks.title')} "${data.title}" ${t('tasks.createSuccess')}`,
        duration: 3000,
      })
      setTimeout(() => {
        router.push("/tasks")
      }, 1000)
    } catch (error) {
      console.error('Error creating task:', error)
      toast({
        title: `❌ ${t('common.error')}`,
        description: t('tasks.createError'),
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return <TaskForm users={users} onSubmit={handleCreateTask} isSubmitting={isSubmitting} />
}
