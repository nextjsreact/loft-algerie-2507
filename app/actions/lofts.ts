"use server"

import { requireRole } from "@/lib/auth"
import { redirect } from "next/navigation"
import type { Database } from "@/lib/types"
import { createClient } from '@/utils/supabase/server' // Import the new createClient

type Loft = Database['public']['Tables']['lofts']['Row']

export async function getLofts() {
  const supabase = await createClient() // Create client here
  const { data: lofts, error } = await supabase
    .from("lofts")
    .select("id, name")
    .order("name")

  if (error) {
    console.error("Error getting lofts:", error)
    throw error
  }

  return lofts
}

export async function deleteLoft(id: string) {
  await requireRole(["admin"])

  const supabase = await createClient() // Create client here
  const { error } = await supabase.from("lofts").delete().eq("id", id)

  if (error) {
    console.error("Error deleting loft:", error)
    throw error
  }

  redirect("/lofts")
}

export async function getLoft(id: string): Promise<Loft | null> {
  const supabase = await createClient() // Create client here
  const { data: loft, error } = await supabase
    .from("lofts")
    .select("*, owner:loft_owners(name)")
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching loft:", error)
    return null
  }

  return loft as unknown as Loft
}

export async function updateLoft(id: string, data: Omit<Loft, "id" | "created_at" | "updated_at">) {
  await requireRole(["admin"])

  const supabase = await createClient() // Create client here
  const { error } = await supabase
    .from("lofts")
    .update(data)
    .eq("id", id)

  if (error) {
    console.error("Error updating loft:", error)
    throw error
  }
}

interface CreateLoftResult {
  success: boolean
  loftId: string
}

export async function createLoft(data: Omit<Loft, "id" | "created_at" | "updated_at">): Promise<CreateLoftResult> {
  await requireRole(["admin"])

  const supabase = await createClient() // Create client here
  const { data: newLoft, error } = await supabase
    .from("lofts")
    .insert(data)
    .select()
    .single()

  if (error) {
    console.error("Error creating loft:", error)
    throw error
  }
    
  return {
    success: true,
    loftId: newLoft.id
  }
}

export async function linkLoftToAirbnb(id: string, formData: FormData) {
  await requireRole(["admin"])

  const supabase = await createClient()
  const airbnb_listing_id = formData.get("airbnb_listing_id") as string

  const { error } = await supabase
    .from("lofts")
    .update({ airbnb_listing_id })
    .eq("id", id)

  if (error) {
    console.error("Error linking loft to Airbnb:", error)
    throw error
  }

  redirect(`/lofts/${id}`)
}
