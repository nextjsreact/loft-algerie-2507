"use client"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { getColumns } from "../columns" // Import getColumns
import { Currency } from "@/lib/types"

interface CurrencyClientProps {
  data: Currency[]
  onSetDefault: (id: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export const CurrencyClient = ({ data, onSetDefault, onDelete }: CurrencyClientProps) => {
  const router = useRouter()

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Currencies (${data.length})`}
          description="Manage currencies for your transactions"
        />
        <Button onClick={() => router.push("/settings/currencies/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable key={data.length} columns={getColumns(onSetDefault, onDelete)} data={data} />
    </>
  )
}
