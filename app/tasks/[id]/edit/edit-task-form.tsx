'use client'

import { TaskForm } from '@/components/forms/task-form'
import { getTask, updateTask } from '@/app/actions/tasks'
import { TaskFormData } from '@/lib/validations'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import type { Task, User } from '@/lib/types'

interface EditTaskFormProps {
  initialTask: Task | null;
  users: User[];
}

export default function EditTaskForm({ initialTask, users }: EditTaskFormProps) {
  const params = useParams()
  const id = params.id as string
  const [task, setTask] = useState<Task | null>(initialTask)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // If initialTask is provided, we don't need to fetch it again on the client side
    // This useEffect is primarily for cases where initialTask might be null from the server
    // or to re-fetch if the ID changes for some reason (though not typical for edit pages)
    if (!initialTask && id) {
      getTask(id).then(setTask)
    }
  }, [id, initialTask])

  const handleUpdateTask = async (data: TaskFormData) => {
    if (!id) return
    setIsSubmitting(true)
    try {
      await updateTask(id, data)
    } catch (error) {
      console.error(error)
      // Handle error state in the form
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!task) return <div>Loading...</div>

  return <TaskForm task={task} users={users} onSubmit={handleUpdateTask} isSubmitting={isSubmitting} />
}
