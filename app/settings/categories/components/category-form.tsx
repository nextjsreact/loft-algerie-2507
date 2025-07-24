"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card" // Import Card components
import { Category } from "@/lib/types"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

const categorySchema = z.object({
  name: z.string().min(2),
  description: z.string().nullable(),
  type: z.enum(["income", "expense"]),
})

type CategoryFormValues = z.infer<typeof categorySchema>

interface CategoryFormProps {
  category?: Category
  createCategory: (data: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => Promise<any>
  updateCategory: (id: string, data: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => Promise<any>
}

export function CategoryForm({
  category,
  createCategory,
  updateCategory,
}: CategoryFormProps) {
  const router = useRouter()
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
      type: category?.type || "income",
    },
  })

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      if (category) {
        await updateCategory(category.id, data)
        toast({
          title: "✅ Success",
          description: `Category "${data.name}" updated successfully`,
          duration: 3000,
        })
      } else {
        await createCategory(data)
        toast({
          title: "✅ Success",
          description: `Category "${data.name}" created successfully`,
          duration: 3000,
        })
      }
      setTimeout(() => {
        router.push("/settings/categories")
      }, 1000)
    } catch (error) {
      console.error('Error saving category:', error)
      toast({
        title: "❌ Error",
        description: "Failed to save category - please try again",
        variant: "destructive",
        duration: 5000,
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>{category ? "Edit Category" : "Create New Category"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-full flex justify-end mt-4">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? "Saving..."
                  : category
                  ? "Save Changes"
                  : "Create Category"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
