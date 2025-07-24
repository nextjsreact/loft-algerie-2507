'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Calendar, Clock, CheckCircle } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import { BillPaymentModal } from '@/components/modals/bill-payment-modal'
import { useTranslation } from '@/lib/i18n/context'
import { markBillAsPaid as markBillAsPaidAction } from '@/app/actions/bill-notifications'

interface BillAlert {
  loft_id: string
  loft_name: string
  owner_id: string
  utility_type: string
  due_date: string
  frequency: string
  days_until_due?: number
  days_overdue?: number
}

type UtilityType = keyof typeof UTILITY_LABELS;

const UTILITY_LABELS = {
  eau: 'bills.utilities.eau',
  energie: 'bills.utilities.energie', 
  telephone: 'bills.utilities.telephone',
  internet: 'bills.utilities.internet'
}

const UTILITY_COLORS = {
  eau: 'bg-blue-100 text-blue-800',
  energie: 'bg-yellow-100 text-yellow-800',
  telephone: 'bg-green-100 text-green-800',
  internet: 'bg-purple-100 text-purple-800'
}

export function BillAlerts() {
  const { t } = useTranslation()
  const [upcomingBills, setUpcomingBills] = useState<BillAlert[]>([])
  const [overdueBills, setOverdueBills] = useState<BillAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBill, setSelectedBill] = useState<BillAlert | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchBillAlerts()
  }, [])

  const fetchBillAlerts = async () => {
    try {
      setLoading(true)

      // Fetch upcoming bills (next 30 days)
      const { data: upcoming, error: upcomingError } = await supabase
        .rpc('get_upcoming_bills', { days_ahead: 30 })

      if (upcomingError) {
        console.error('Error fetching upcoming bills:', upcomingError)
      } else {
        setUpcomingBills(upcoming || [])
      }

      // Fetch overdue bills
      const { data: overdue, error: overdueError } = await supabase
        .rpc('get_overdue_bills')

      if (overdueError) {
        console.error('Error fetching overdue bills:', overdueError)
      } else {
        setOverdueBills(overdue || [])
      }
    } catch (error) {
      console.error('Error fetching bill alerts:', error)
      toast.error(t('bills.failedToLoadAlerts'))
    } finally {
      setLoading(false)
    }
  }

  const markBillAsPaid = (bill: BillAlert) => {
    setSelectedBill(bill);
    setIsModalOpen(true);
  }

  const handlePayBill = (bill: BillAlert) => {
    setSelectedBill(bill)
    setIsModalOpen(true)
  }

  const handlePaymentSuccess = () => {
    fetchBillAlerts() // Refresh the alerts after successful payment
  }

  const getBadgeVariant = (daysUntilDue?: number, daysOverdue?: number) => {
    if (daysOverdue && daysOverdue > 0) return 'destructive'
    if (daysUntilDue !== undefined) {
      if (daysUntilDue === 0) return 'destructive'
      if (daysUntilDue <= 3) return 'secondary'
      return 'default'
    }
    return 'default'
  }

  const getIcon = (daysUntilDue?: number, daysOverdue?: number) => {
    if (daysOverdue && daysOverdue > 0) return <AlertTriangle className="h-4 w-4" />
    if (daysUntilDue !== undefined) {
      if (daysUntilDue === 0) return <AlertTriangle className="h-4 w-4" />
      if (daysUntilDue <= 3) return <Clock className="h-4 w-4" />
      return <Calendar className="h-4 w-4" />
    }
    return <Calendar className="h-4 w-4" />
  }

  const getUtilityLabel = (utilityType: string) => {
    return t(UTILITY_LABELS[utilityType as UtilityType]) || utilityType
  }

  const getDaysText = (days: number, isOverdue: boolean = false) => {
    if (days === 0) return t('bills.dueToday')
    if (days === 1) {
      if (isOverdue) return `1 ${t('bills.dayOverdue')}`
      return t('bills.dueTomorrow')
    }
    if (isOverdue) return `${days} ${t('bills.daysOverdue')}`
    return `${days} ${t('bills.days')}`
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {t('bills.upcomingBills')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              {t('bills.overdueBills')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Upcoming Bills */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {t('bills.upcomingBills')} ({upcomingBills.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingBills.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
              <p>{t('bills.noUpcomingBills')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingBills.map((bill, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getIcon(bill.days_until_due)}
                    <div>
                      <div className="font-medium">{bill.loft_name}</div>
                      <div className="text-sm text-gray-600">
                        {getUtilityLabel(bill.utility_type)} - 
                        {t('bills.due')}: {new Date(bill.due_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={getBadgeVariant(bill.days_until_due)}
                      className={UTILITY_COLORS[bill.utility_type as keyof typeof UTILITY_COLORS]}
                    >
                      {getDaysText(bill.days_until_due || 0)}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => markBillAsPaid(bill)}
                    >
                      {t('bills.markPaid')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Overdue Bills */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            {t('bills.overdueBills')} ({overdueBills.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {overdueBills.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
              <p>{t('bills.noOverdueBills')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {overdueBills.map((bill, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg border-red-200 bg-red-50">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <div>
                      <div className="font-medium">{bill.loft_name}</div>
                      <div className="text-sm text-gray-600">
                        {getUtilityLabel(bill.utility_type)} - 
                        {t('bills.due')}: {new Date(bill.due_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">
                      {getDaysText(bill.days_overdue || 0, true)}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => markBillAsPaid(bill)}
                    >
                      {t('bills.markPaid')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      {selectedBill && (
        <BillPaymentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          loftId={selectedBill.loft_id}
          loftName={selectedBill.loft_name}
          utilityType={selectedBill.utility_type as UtilityType}
          dueDate={selectedBill.due_date}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  )
}
