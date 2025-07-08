import { CategoryForm } from "../components/category-form"
import { createCategory, updateCategory } from "@/app/actions/categories"

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <CategoryForm createCategory={createCategory} updateCategory={updateCategory} />
    </div>
  )
}
