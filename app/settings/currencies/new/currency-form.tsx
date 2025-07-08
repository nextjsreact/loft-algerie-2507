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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card" // Import Card components
import { Currency } from "@/lib/types"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const currencySchema = z.object({
  code: z.string().min(3).max(3),
  name: z.string().min(2),
  symbol: z.string().min(1).max(3),
  is_default: z.boolean(), // Make is_default required
  ratio: z.coerce.number().min(0), // Make ratio required
})

type CurrencyFormValues = z.infer<typeof currencySchema>

interface CurrencyFormProps {
  currency?: Currency
  createCurrency: (data: Omit<Currency, 'id' | 'created_at' | 'updated_at'>) => Promise<any>
  updateCurrency: (id: string, data: Omit<Currency, 'id' | 'created_at' | 'updated_at'>) => Promise<any>
}

export function CurrencyForm({
  currency,
  createCurrency,
  updateCurrency,
}: CurrencyFormProps) {
  const router = useRouter()
  const form = useForm<CurrencyFormValues>({
    resolver: zodResolver(currencySchema),
    defaultValues: {
      code: currency?.code || "",
      name: currency?.name || "",
      symbol: currency?.symbol || "",
      is_default: currency?.is_default || false, // Use is_default
      ratio: currency?.ratio || 0,
    },
  })

  const onSubmit = async (data: CurrencyFormValues) => {
    try {
      const { is_default, ...rest } = data; // Destructure to match db
      const dataToSave = { ...rest, is_default };

      if (currency) {
        await updateCurrency(currency.id, dataToSave)
        toast.success("Currency updated")
      } else {
        await createCurrency(dataToSave)
        toast.success("Currency created")
      }
      router.push("/settings/currencies")
    } catch (error: any) {
      toast.error(error.message || "Something went wrong")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>{currency ? "Edit Currency" : "Create Currency"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                name="symbol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Symbol</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ratio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ratio</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        value={field.value !== undefined && field.value !== null ? String(field.value).replace('.', ',') : ''}
                        onChange={(e) => {
                          const value = e.target.value.replace(',', '.');
                          if (/^-?\d*\.?\d{0,2}$/.test(value)) { // Regex to allow numbers with up to 2 decimal places
                            field.onChange(value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="is_default"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Set as Default Currency</FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting
            ? "Saving..."
            : currency
            ? "Save Changes"
            : "Create Currency"}
        </Button>
      </form>
    </Form>
  )
}
