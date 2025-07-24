import { requireRole } from "@/lib/auth"
import { TransactionReferenceAmounts } from "@/components/transactions/transaction-reference-amounts"

export default async function TransactionReferenceAmountsPage() {
  // Only admins and managers can manage reference amounts
  await requireRole(["admin", "manager"])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Montants de Référence des Transactions</h1>
        <p className="text-muted-foreground">
          Gérez les montants de référence pour chaque catégorie de transaction. Le système vous alertera automatiquement si un montant dépasse +20% de la référence.
        </p>
      </div>

      <TransactionReferenceAmounts />
    </div>
  )
}