import { requireRole } from "@/lib/auth"
import { getTasks } from "@/app/actions/tasks"
import { getUsers } from "@/app/actions/users"
import { TasksPageClient } from "./tasks-page-client"

export default async function TasksPage() {
  const session = await requireRole(["admin", "manager", "member"])
  const tasks = await getTasks()
  const users = await getUsers()

  return (
    <TasksPageClient 
      tasks={tasks}
      users={users}
      userRole={session.user.role}
      currentUserId={session.user.id}
    />
  )
}
