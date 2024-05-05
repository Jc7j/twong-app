import React from 'react'
import { Invoice, Property } from '@/lib/definitions' // Assuming these are defined in your definitions file
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from '@/components/ui/dialog'
import { formatDate, formatDateWithTime } from '@/lib/utils'

interface DetailedInvoiceViewProps {
  invoice: Invoice
  property: Property
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

const DetailedInvoiceView: React.FC<DetailedInvoiceViewProps> = ({
  invoice,
  property,
  isOpen,
  onOpenChange,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-2xl font-medium">{property.name}</h2>
          <p className="text-sm">{formatDate(invoice.invoice_month)}</p>
          <div className="text-sm text-primary mt-5">
            <p>{property.owner?.name}</p>
            <p>{property.address}</p>
            <p>{property.owner?.email}</p>
            <p>{property.owner?.phone_number}</p>
          </div>
        </DialogHeader>
        <hr />
        <div className="h-[250px] overflow-y-auto">
          <h3 className="text-xl font-medium">Charges and Reimbursements</h3>
          {invoice.management_fee && (
            <span className="flex justify-between font-normal text-sm">
              <p>Property Management Fee</p> <p>${invoice.management_fee}</p>
            </span>
          )}
        </div>
        <hr />
        <DialogFooter className="flex flex-col">
          <p className="text-xs text-primary">taxes (8.375%)</p>
          <span className="flex justify-between items-end">
            <p className="text-xl mt-3">Total:</p>
            <p>${invoice.total}</p>
          </span>
        </DialogFooter>
        <hr />
        <p className="text-sm text-secondary text-center">
          Last Modified {formatDateWithTime(invoice.last_modified)}
        </p>
      </DialogContent>
    </Dialog>
  )
}

export default DetailedInvoiceView
