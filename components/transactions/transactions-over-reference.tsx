'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertTriangle, TrendingUp, TrendingDown, RefreshCw, Calendar } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'

interface TransactionOverReference {
  transaction_id: string
  description: string
  amount: number
  currency: string
  transaction_type: 'income' | 'expense'
  category: string
  reference_amount: number
  percentage_over: number
  loft_name: string
  created_at: string
}

export function TransactionsOverReference() {
  const [transactions, setTransactions] = useState<TransactionOverReference[]>([])
  const [loading, setLoading] = useState(true)
  const [daysBack, setDaysBack] = useState(30)
  const supabase = createClient()

  useEffect(() => {
    fetchTransactions()
  }, [daysBack])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.rpc('get_transactions_over_reference', { days_back: daysBack })
      
      if (error) {
        throw error
      }
      
      setTransactions(data || [])
    } catch (error) {
      console.error('Error fetching transactions over reference:', error)
      toast.error('Erreur lors du chargement des transactions')
    } finally {
      setLoading(false)
    }
  }

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      maintenance: '🔧', cleaning: '🧹', repair: '🛠️', plumbing: '🚰',
      electrical: '⚡', painting: '🎨', security: '🔒', inspection: '🔍',
      utilities: '💡', insurance: '🛡️', taxes: '📋', supplies: '📦',
      rent: '🏠', deposit: '💰', late_fees: '⏰', parking: '🚗',
      services: '🔧', other: '📋'
    }
    return icons[category] || '📋'
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      maintenance: 'Maintenance', cleaning: 'Nettoyage', repair: 'Réparations',
      plumbing: 'Plomberie', electrical: 'Électricité', painting: 'Peinture',
      security: 'Sécurité', inspection: 'Inspections', utilities: 'Factures Utilitaires',
      insurance: 'Assurances', taxes: 'Taxes et Impôts', supplies: 'Fournitures',
      rent: 'Loyers', deposit: 'Cautions', late_fees: 'Frais de Retard',
      parking: 'Parking', services: 'Services', other: 'Autres'
    }
    return labels[category] || category
  }

  const getPercentageBadgeVariant = (percentage: number) => {
    if (percentage >= 50) return 'destructive'
    if (percentage >= 30) return 'secondary'
    return 'default'
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Transactions au-dessus des Références
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Transactions au-dessus des Références ({transactions.length})
        </CardTitle>
        <div className="flex items-center gap-2">
          <Select value={daysBack.toString()} onValueChange={(value) => setDaysBack(parseInt(value))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 jours</SelectItem>
              <SelectItem value="30">30 jours</SelectItem>
              <SelectItem value="90">90 jours</SelectItem>
              <SelectItem value="365">1 an</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" variant="outline" onClick={fetchTransactions} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-green-500" />
            <p>Aucune transaction au-dessus des références</p>
            <p className="text-sm">Toutes les transactions respectent les montants de référence</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.transaction_id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getCategoryIcon(transaction.category)}</span>
                    <div>
                      <div className="font-medium">{transaction.description || 'Transaction sans description'}</div>
                      <div className="text-sm text-gray-600 flex items-center gap-2">
                        {transaction.transaction_type === 'expense' ? (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        ) : (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        )}
                        {getCategoryLabel(transaction.category)} • {transaction.loft_name || 'Loft non spécifié'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-semibold text-lg">
                      {transaction.amount.toLocaleString()} {transaction.currency}
                    </div>
                    <div className="text-sm text-gray-500">
                      Réf: {transaction.reference_amount.toLocaleString()} {transaction.currency}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {new Date(transaction.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  
                  <Badge variant={getPercentageBadgeVariant(transaction.percentage_over)}>
                    +{transaction.percentage_over.toFixed(1)}% au-dessus
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}