"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Currency } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

export const getColumns = (
  onSetDefault: (id: string) => Promise<void>,
  onDelete: (id: string) => Promise<void>
): ColumnDef<Currency>[] => {
  return [
    {
      accessorKey: "code",
      header: "Code",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "symbol",
      header: "Symbol",
    },
    {
      accessorKey: "ratio",
      header: "Ratio",
      cell: ({ row }) => {
        const ratio = parseFloat(row.getValue("ratio"))
        return new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(ratio)
      }
    },
    {
      accessorKey: "is_default", // Change to snake_case
      header: "Default",
      cell: ({ row }) => {
        console.log(`Currency ${row.original.code} is_default:`, row.original.is_default); // Debugging log
        return (row.original.is_default ? "Yes" : "No"); // Change to snake_case
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const currency = row.original
        const router = useRouter()

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(currency.id)}
              >
                Copy currency ID
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/settings/currencies/edit/${currency.id}`)}>Edit currency</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSetDefault(currency.id)}>Set as default</DropdownMenuItem>
              <DropdownMenuItem 
                onClick={async () => {
                  if (confirm("Are you sure you want to delete this currency?")) {
                    await onDelete(currency.id)
                  }
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}
