import { getTask, updateTask } from '@/app/actions/tasks'
import { getUsers } from '@/app/actions/users'
import EditTaskForm from './edit-task-form'
import { notFound } from 'next/navigation'

interface EditTaskPageProps {
  params: {
    id: string
  }
}

export default async function EditTaskPage({ params }: EditTaskPageProps) {
  const { id } = await params;
  const task = await getTask(id)
  const users = await getUsers()

  if (!task) {
    notFound()
  }

  return <EditTaskForm initialTask={task} users={users} />
}
