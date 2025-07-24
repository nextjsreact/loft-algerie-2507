import { requireRole } from "@/lib/auth"
import { createClient } from "@/utils/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Users } from "lucide-react"
import Link from "next/link"
import { getTranslations } from "@/lib/i18n/server"

export default async function TeamsPage() {
  const session = await requireRole(["admin", "manager"])
  const supabase = await createClient()
  const t = await getTranslations()

  const { data: teams, error } = await supabase
    .from("teams")
    .select(
      `
      *,
      profiles (full_name),
      team_members (user_id),
      tasks (status)
    `
    )
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  const teamsWithStats = teams.map((team: any) => {
    const created_by_name = team.profiles?.full_name || "N/A"
    const member_count = team.team_members.length
    const active_tasks = (team.tasks as { status: string }[]).filter(
      (task) => task.status === "todo" || task.status === "in_progress"
    ).length

    return {
      ...team,
      created_by_name,
      member_count: String(member_count),
      active_tasks: String(active_tasks),
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('teams.title')}</h1>
          <p className="text-muted-foreground">{t('teams.subtitle')}</p>
        </div>
        {session.user.role === "admin" && (
          <Button asChild>
            <Link href="/teams/new">
              <Plus className="mr-2 h-4 w-4" />
              {t('teams.addTeam')}
            </Link>
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {teamsWithStats.map((team) => (
          <Card key={team.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{team.name}</CardTitle>
                  <CardDescription>{t('teams.createdBy')} {team.created_by_name}</CardDescription>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{Number.parseInt(team.member_count)}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {team.description && <p className="text-sm text-muted-foreground line-clamp-2">{team.description}</p>}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{t('teams.activeTasks')}:</span>
                  <Badge variant="secondary">{Number.parseInt(team.active_tasks)}</Badge>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/teams/${team.id}`}>{t('common.view')}</Link>
                </Button>
                {session.user.role === "admin" && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/teams/${team.id}/edit`}>{t('common.edit')}</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
