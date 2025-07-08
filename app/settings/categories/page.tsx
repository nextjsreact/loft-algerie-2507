import { requireRole } from "@/lib/auth"
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/app/actions/categories"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CategoriesList } from "./categories-list"
import { CategoryForm } from "./components/category-form"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function CategoriesPage() {
  await requireRole(["admin", "manager"]) // Allow managers to access
  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">Manage your transaction categories</p>
        </div>
        <Button asChild>
          <Link href="/settings/categories/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Existing Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoriesList categories={categories} onDelete={deleteCategory} />
        </CardContent>
      </Card>
    </div>
  )
}
