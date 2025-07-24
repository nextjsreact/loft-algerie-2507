"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"
import type { Team } from "@/lib/database"

interface TeamFormProps {
  team?: Team
  action: (formData: FormData) => Promise<{ error?: string; team?: Team }>
}

export function TeamForm({ team, action }: TeamFormProps) {
  const [error, setError] = useState("")
  const router = useRouter()
  const { pending } = useFormStatus()

  const handleSubmit = async (formData: FormData) => {
    try {
      const result = await action(formData)
      if (result?.error) {
        setError(result.error)
        toast({
          title: "❌ Error",
          description: result.error,
          variant: "destructive",
          duration: 5000,
        })
      } else if (result?.team) {
        toast({
          title: "✅ Success",
          description: `Team "${result.team.name}" ${team ? 'updated' : 'created'} successfully`,
          duration: 3000,
        })
        setTimeout(() => {
          router.push(`/teams/${result.team.id}`)
        }, 1000)
      } else {
        const teamName = formData.get("name") as string
        toast({
          title: "✅ Success",
          description: `Team "${teamName}" ${team ? 'updated' : 'created'} successfully`,
          duration: 3000,
        })
        setTimeout(() => {
          router.push("/teams")
        }, 1000)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      toast({
        title: "❌ Error",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      })
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{team ? "Edit Team" : "Create Team"}</CardTitle>
        <CardDescription>{team ? "Update team information" : "Add a new team"}</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Team Name</Label>
            <Input 
              id="name" 
              name="name" 
              defaultValue={team?.name || ""}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              name="description"
              defaultValue={team?.description || ""}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={pending}>
              {pending ? "Saving..." : team ? "Update Team" : "Create Team"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
