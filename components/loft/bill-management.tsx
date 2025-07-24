'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertTriangle, Calendar, CheckCircle, Clock, DollarSign, Zap, Droplets, Phone, Wifi } from 'lucide-react'
import { toast } from 'sonner'
import { markBillAsPaid } from '@/app/actions/bill-notifications'

interface BillInfo {
  type: 'eau' | 'energie' | 'telephone' | 'internet'
  label: string
  icon: React.ReactNode
  frequency: string | null
  dueDate: string | null
  daysUntilDue: number | null
  isOverdue: boolean
}

interface LoftBillManagementProps {
  loftId: string
  loftData: any
}

const UTILITY_CONFIG = {
  eau: { label: 'Water', icon: <Droplets className="h-4 w-4" />, color: 'bg-blue-100 text-blue-800' },
  energie: { label: 'Energy', icon: <Zap className="h-4 w-4" />, color: 'bg-yellow-100 text-yellow-800' },
  telephone: { label: 'Phone', icon: <Phone className="h-4 w-4" />, color: 'bg-green-100 text-green-800' },
  internet: { label: 'Internet', icon: <Wifi className="h-4 w-4" />, color: 'bg-purple-100 text-purple-800' }
}

export function LoftBillManagement({ loftId, loftData }: LoftBillManagementProps) {
  const [bills, setBills] = useState<BillInfo[]>([])
  const [loading, setLoading] = useState(false)
  const [paymentDialog, setPaymentDialog] = useState<{ open: boolean; bill: BillInfo | null }>({ open: false, bill: null })
  const [paymentAmount, setPaymentAmount] = useState('')

  useEffect(() => {
    processBillData()
  }, [loftData])

  const processBillData = () => {
    const today = new Date()
    const billsData: BillInfo[] = []

    Object.keys(UTILITY_CONFIG).forEach((type) => {
      const utilityType = type as keyof typeof UTILITY_CONFIG
      const frequency = loftData[`frequence_paiement_${utilityType}`]
      const dueDate = loftData[`prochaine_echeance_${utilityType}`]
      
      let daysUntilDue: number | null = null
      let isOverdue = false

      if (dueDate) {
        const dueDateObj = new Date(dueDate)
        const timeDiff = dueDateObj.getTime() - today.getTime()
        daysUntilDue = Math.ceil(timeDiff / (1000 * 3600 * 24))
        isOverdue = daysUntilDue < 0
      }

      billsData.push({
        type: utilityType,
        label: UTILITY_CONFIG[utilityType].label,
        icon: UTILITY_CONFIG[utilityType].icon,
        frequency,
        dueDate,
        daysUntilDue,
        isOverdue
      })
    })

    setBills(billsData)
  }

  const getBadgeVariant = (bill: BillInfo) => {
    if (!bill.dueDate) return 'secondary'
    if (bill.isOverdue) return 'destructive'
    if (bill.daysUntilDue !== null && bill.daysUntilDue <= 3) return 'default'
    return 'outline'
  }

  const getBadgeText = (bill: BillInfo) => {
    if (!bill.dueDate) return 'Not Set'
    if (bill.isOverdue) return `${Math.abs(bill.daysUntilDue!)} days overdue`
    if (bill.daysUntilDue === 0) return 'Due Today'
    if (bill.daysUntilDue === 1) return 'Due Tomorrow'
    if (bill.daysUntilDue! <= 7) return `Due in ${bill.daysUntilDue} days`
    return `Due ${new Date(bill.dueDate).toLocaleDateString()}`
  }

  const getStatusIcon = (bill: BillInfo) => {
    if (!bill.dueDate) return <Calendar className="h-4 w-4 text-gray-400" />
    if (bill.isOverdue) return <AlertTriangle className="h-4 w-4 text-red-500" />
    if (bill.daysUntilDue !== null && bill.daysUntilDue <= 3) return <Clock className="h-4 w-4 text-orange-500" />
    return <CheckCircle className="h-4 w-4 text-green-500" />
  }

  const handleMarkAsPaid = async () => {
    if (!paymentDialog.bill || !paymentAmount) {
      toast.error('Please enter a payment amount')
      return
    }

    setLoading(true)
    try {
      const result = await markBillAsPaid(
        loftId,
        paymentDialog.bill.type,
        parseFloat(paymentAmount),
        `${paymentDialog.bill.label} bill payment`
      )

      if (result.success) {
        toast.success(`${paymentDialog.bill.label} bill marked as paid. Next due date calculated automatically.`)
        setPaymentDialog({ open: false, bill: null })
        setPaymentAmount('')
        
        // Refresh the page to show updated data
        window.location.reload()
      } else {
        toast.error(result.message || 'Failed to mark bill as paid')
      }
    } catch (error) {
      console.error('Error marking bill as paid:', error)
      toast.error('Failed to mark bill as paid')
    } finally {
      setLoading(false)
    }
  }

  const openPaymentDialog = (bill: BillInfo) => {
    setPaymentDialog({ open: true, bill })
    setPaymentAmount('')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Bill Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bills.map((bill) => (
            <div key={bill.type} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {bill.icon}
                <div>
                  <div className="font-medium">{bill.label}</div>
                  <div className="text-sm text-gray-600">
                    {bill.frequency ? `Frequency: ${bill.frequency}` : 'No frequency set'}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {getStatusIcon(bill)}
                <Badge 
                  variant={getBadgeVariant(bill)}
                  className={bill.dueDate ? UTILITY_CONFIG[bill.type].color : ''}
                >
                  {getBadgeText(bill)}
                </Badge>
                
                {bill.dueDate && (
                  <Button
                    size="sm"
                    variant={bill.isOverdue ? "destructive" : "outline"}
                    onClick={() => openPaymentDialog(bill)}
                    disabled={loading}
                  >
                    Mark as Paid
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {bills.every(bill => !bill.dueDate) && (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No bill due dates set</p>
            <p className="text-sm">Edit the loft to add bill frequencies and due dates</p>
          </div>
        )}
      </CardContent>

      {/* Payment Dialog */}
      <Dialog open={paymentDialog.open} onOpenChange={(open) => setPaymentDialog({ open, bill: paymentDialog.bill })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark {paymentDialog.bill?.label} Bill as Paid</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">Payment Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="Enter payment amount"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
              />
            </div>
            
            {paymentDialog.bill?.dueDate && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Current Due Date:</strong> {new Date(paymentDialog.bill.dueDate).toLocaleDateString()}
                </p>
                {paymentDialog.bill.frequency && (
                  <p className="text-sm text-blue-600 mt-1">
                    Next due date will be automatically calculated based on {paymentDialog.bill.frequency} frequency.
                  </p>
                )}
              </div>
            )}
            
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setPaymentDialog({ open: false, bill: null })}
              >
                Cancel
              </Button>
              <Button
                onClick={handleMarkAsPaid}
                disabled={loading || !paymentAmount}
              >
                {loading ? 'Processing...' : 'Mark as Paid'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}