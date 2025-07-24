
'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { BillPaymentForm } from '@/components/forms/bill-payment-form'
import { useTranslation } from '@/lib/i18n/context'
import { billPaymentTranslations } from '@/lib/i18n/bill-payment-translations'

interface BillPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  loftId: string
  loftName: string
  utilityType: 'eau' | 'energie' | 'telephone' | 'internet'
  dueDate: string
  onSuccess: () => void
}

export function BillPaymentModal({
  isOpen,
  onClose,
  loftId,
  loftName,
  utilityType,
  dueDate,
  onSuccess
}: BillPaymentModalProps) {
  const { t, language } = useTranslation()

  const handleSuccess = () => {
    onSuccess()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{billPaymentTranslations[language].title}</DialogTitle>
        </DialogHeader>
        <BillPaymentForm
          loftId={loftId}
          loftName={loftName}
          utilityType={utilityType}
          dueDate={dueDate}
          onSuccess={handleSuccess}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  )
}
