'use client'

import React, { useState } from 'react'
import { Invoice, Property } from '@/lib/definitions' // Assuming these are defined in your definitions file
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from '@/components/ui/dialog'
import { formatDateToISO, formatDateWithTime } from '@/lib/utils'
import { updateInvoiceMonth } from '@/lib/supabase/invoiceApi'
import { EditableField } from '../EditableField'
import { EditModeToggle } from '../EditModeToggle'
import { monthYearSchema } from '@/lib/schemas'
import { usePropertiesStore } from '@/hooks/stores/usePropertiesStore'

interface DetailedInvoiceViewProps {
  invoice: Invoice
  property: Property
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export function DetailedInvoiceView({
  invoice,
  property,
  isOpen,
  onOpenChange,
}: DetailedInvoiceViewProps) {
  const { fetchProperties } = usePropertiesStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editedMonth, setEditedMonth] = useState(() => {
    const date = new Date(invoice.invoice_month)
    const monthName = date.toLocaleString('default', { month: 'long' })
    const year = date.getFullYear()
    return `${monthName} ${year}`
  })

  async function handleSave() {
    const validationResult = monthYearSchema.safeParse(editedMonth)
    if (validationResult.success) {
      const isoDate = formatDateToISO(editedMonth)
      try {
        setIsEditing(false)
        await updateInvoiceMonth(invoice.invoice_id, isoDate)
      } catch (error) {
        console.error('Error updating invoice:', error)
      }
      await fetchProperties()
    } else {
      alert(validationResult.error.message)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-2xl font-medium">{property.name}</h2>
          <span>
            <EditableField
              className="text-sm"
              onChange={(value: string) => setEditedMonth(value)}
              isEditing={isEditing}
              value={editedMonth}
            />
            <EditModeToggle
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              handleSave={handleSave}
            />
          </span>
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
