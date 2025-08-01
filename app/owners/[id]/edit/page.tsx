import { requireRole } from "@/lib/auth"
import { createClient } from "@/utils/supabase/server"
import { OwnerForm } from "@/components/forms/owner-form"
import { updateOwner } from "@/app/actions/owners"

export default async function EditOwnerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await requireRole(["admin"])
  const supabase = await createClient()

  const { data: owner, error } = await supabase
    .from("loft_owners")
    .select("*")
    .eq("id", id)
    .single()

  if (!owner) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Owner Not Found</h1>
          <p className="text-muted-foreground">Could not find owner with ID {id}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Owner</h1>
        <p className="text-muted-foreground">Update owner information</p>
      </div>

      <OwnerForm 
        owner={owner}
        action={updateOwner.bind(null, id)}
      />
    </div>
  )
}
