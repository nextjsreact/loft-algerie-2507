"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { transactionSchema } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTranslation } from "@/lib/i18n/context"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const statusOptions = ["pending", "completed", "failed"] as const
const typeOptions = ["income", "expense"] as const

export function NewTransactionForm({ onSubmit }: { 
  onSubmit: (data: z.infer<typeof transactionSchema>) => Promise<void> 
}) {
  const { t } = useTranslation()
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<z.infer<typeof transactionSchema>>({
    defaultValues: {
      transaction_type: "income",
      status: "completed",
      amount: 0,
      description: "",
      date: new Date().toISOString().split('T')[0]
    }
  })

  console.log('Current form values:', watch())

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t('transactions.type')}</Label>
          <Select 
            onValueChange={(value: "income" | "expense") => {
              console.log('Type selected:', value)
              setValue("transaction_type", value)
            }}
            defaultValue="income"
          >
            <SelectTrigger>
              <SelectValue placeholder={t('common.selectOption')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">{t('transactions.income')}</SelectItem>
              <SelectItem value="expense">{t('transactions.expense')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t('transactions.status')}</Label>
          <Select
            onValueChange={(value: "pending" | "completed" | "failed") => {
              console.log('Status selected:', value)
              setValue("status", value)
            }}
            defaultValue="completed"
          >
            <SelectTrigger>
              <SelectValue placeholder={t('common.selectOption')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">{t('transactions.pending')}</SelectItem>
              <SelectItem value="completed">{t('transactions.completed')}</SelectItem>
              <SelectItem value="failed">{t('transactions.failed')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>{t('transactions.amount')}</Label>
        <Input
          type="number"
          step="0.01"
          {...register("amount", { valueAsNumber: true })}
        />
      </div>

      <div className="space-y-2">
        <Label>{t('transactions.date')}</Label>
        <Input
          type="date"
          {...register("date")}
        />
      </div>

      <Button type="submit">{t('transactions.createTransaction')}</Button>
    </form>
  )
}
