"use server"

import { requireRole } from "@/lib/auth"
import { redirect } from "next/navigation"
import type { Database } from "@/lib/types"
import { z } from "zod"
import { taskSchema } from "@/lib/validations"
import { createClient } from '@/utils/supabase/server' // Import the new createClient

type Task = Database['public']['Tables']['tasks']['Row']

export async function getTasks() {
  const supabase = await createClient() // Create client here
  const { data: tasks, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error getting tasks:", error)
    throw error
  }

  return tasks
}

export async function getTask(id: string): Promise<Task | null> {
  const supabase = await createClient() // Create client here
  const { data: task, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching task:", error)
    return null
  }

  return task
}

export async function createTask(data: unknown) {
  const session = await requireRole(["admin", "manager"])
  const validatedData = taskSchema.parse(data);

  const supabase = await createClient() // Create client here
  const { error } = await supabase.from("tasks").insert({
    ...validatedData,
    // created_by: session.user.id, // created_by does not exist on this table
  })

  if (error) {
    console.error("Error creating task:", error)
    throw error
  }
    
  redirect("/tasks")
}

export async function updateTask(id: string, data: unknown) {
  await requireRole(["admin", "manager"])
  const validatedData = taskSchema.parse(data);

  const supabase = await createClient() // Create client here
  const { error } = await supabase
    .from("tasks")
    .update(validatedData)
    .eq("id", id)

  if (error) {
    console.error("Error updating task:", error)
    throw error
  }

  redirect(`/tasks/${id}`)
}

export async function deleteTask(id: string) {
  await requireRole(["admin"])

  const supabase = await createClient() // Create client here
  const { error } = await supabase.from("tasks").delete().eq("id", id)

  if (error) {
    console.error("Error deleting task:", error)
    throw error
  }

  redirect("/tasks")
}
