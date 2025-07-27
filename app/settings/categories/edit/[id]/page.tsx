import { getCategory } from "@/app/actions/categories"
import { notFound } from "next/navigation"
import { CategoryForm } from "./category-form"
import { Category } from "@/lib/types"

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  // Await params to ensure it's resolved before accessing properties
  const resolvedParams = await params;
  const category: Category | null = await getCategory(resolvedParams.id)

  if (!category) {
    notFound()
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <CategoryForm initialData={category} />
    </div>
  )
}
