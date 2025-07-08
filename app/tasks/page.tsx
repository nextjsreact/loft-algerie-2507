import { requireRole } from "@/lib/auth"
import { getTasks } from "@/app/actions/tasks"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { TasksList } from "./tasks-list"

export default async function TasksPage() {
  const session = await requireRole(["admin", "manager"])
  const tasks = await getTasks()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">Manage your tasks</p>
        </div>
        {session.user.role === "admin" && (
          <Button asChild>
            <Link href="/tasks/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Link>
          </Button>
        )}
      </div>
      <TasksList tasks={tasks} isAdmin={session.user.role === "admin"} />
    </div>
  )
}
