'use client'

import React, { useEffect, useState } from 'react'
import { Invoice, Property } from '@/lib/definitions'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from '@/components/ui/dialog'
import { formatDate, formatDateToISO, formatDateWithTime } from '@/lib/utils'
import { addInvoiceItem, updateInvoiceMonth } from '@/lib/supabase/invoiceApi'
import { EditableField } from '../EditableField'
import { EditModeToggle } from '../EditModeToggle'
import { monthYearSchema } from '@/lib/schemas'
import { usePropertiesStore } from '@/hooks/stores/usePropertiesStore'
import { useDialogInvoiceOpen } from '@/hooks/useDialogOpen'
import { useSupplyStore } from '@/hooks/stores/useSuppliesStore'

interface DetailedInvoiceViewProps {
  invoice: Invoice
  property: Property
}

export function DetailedInvoiceView({
  invoice,
  property,
}: DetailedInvoiceViewProps) {
  const { selectedProperty, fetchProperty } = usePropertiesStore()
  const { open, setOpen } = useDialogInvoiceOpen()
  const { supplyItems } = useSupplyStore()

  const [isEditing, setIsEditing] = useState(false)
  const [addingItem, setAddingItem] = useState(false)
  const [editedMonth, setEditedMonth] = useState('')
  const [selectedSupplyId, setSelectedSupplyId] = useState<number | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [invoiceItems, setInvoiceItems] = useState([])

  console.log(invoice)

  useEffect(() => {
    if (invoice) {
      const formattedMonth = formatDate(new Date(invoice.invoice_month))
      setEditedMonth(formattedMonth)
      setSelectedSupplyId(supplyItems[0].supply_id)
    }
  }, [invoice])

  if (!selectedProperty) {
    return null
  }

  async function handleSave() {
    const validationResult = monthYearSchema.safeParse(editedMonth)
    if (validationResult.success) {
      const isoDate = formatDateToISO(editedMonth)
      try {
        setIsEditing(false)
        const newUpdatedMonth = await updateInvoiceMonth(
          invoice.invoice_id,
          isoDate
        )
        setEditedMonth(formatDate(newUpdatedMonth))
        await fetchProperty(selectedProperty?.property_id as number)
      } catch (error) {
        console.error('Error updating invoice:', error)
      }
    } else {
      alert(validationResult.error.message)
    }
  }

  async function handleItemSave() {
    if (selectedSupplyId !== null) {
      await addInvoiceItem(invoice.invoice_id, selectedSupplyId, quantity)
      setAddingItem(false)
      // Refresh the invoice details here if needed
    }
  }

  async function handleClose() {
    await fetchProperty(selectedProperty?.property_id as number)
    setOpen(false)
  }

  function calculatedTaxPrice() {
    const invoiceTotal = invoice.total;
    const invoiceManagementFee = invoice.management_fee;
    const taxableAmount = invoiceTotal - invoiceManagementFee;  
    const nevadaTax = 0.08375;  
    const taxedAmount = taxableAmount * nevadaTax;  
    const finalAmount = (taxableAmount - taxedAmount) * nevadaTax
    return Math.ceil(finalAmount * 100) / 100
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          {invoice.management_fee > 0 && (
            <span className="flex justify-between font-normal">
              <p>Property Management Fee</p>
              <p>${invoice.management_fee}</p>
            </span>
          )}
          {invoice.invoiceItems &&
            invoice.invoiceItems.map((item) => (
              <span className="flex justify-between items-end" key={item.item_id}>
                <span>
                <p className='inline text-sm mr-1'>x{item.quantity}</p>
                <p className='inline'>{item.supplyItem?.name}</p>
                </span>
                <p>${(item.supplyItem?.price as number) * item.quantity}</p>
              </span>
            ))}

          {addingItem ? (
            <>
              <select
                value={selectedSupplyId as number}
                onChange={(e) => setSelectedSupplyId(parseInt(e.target.value))}
              >
                {supplyItems.map((item) => (
                  <option key={item.supply_id} value={item.supply_id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
              />
              <button
                onClick={handleItemSave}
                className="mt-4 px-3 py-1 bg-accent text-background rounded text-sm"
              >
                Save changes
              </button>
            </>
          ) : (
            <button
              className="mt-2 px-3 py-1 bg-accent text-background rounded text-sm"
              onClick={() => setAddingItem(true)}
            >
              Add item+
            </button>
          )}
        </div>
        <hr />
        <DialogFooter className="flex flex-col">
          <span className='flex justify-between items-end'>
          <p className="text-xs text-primary">taxes (8.375%)</p>
          <p>${calculatedTaxPrice()}</p>
          </span>
          <span className="flex justify-between items-end">
            <p className="text-xl mt-3">Total:</p>
            <p>${invoice.total}</p>
          </span>
        </DialogFooter>
        <hr />
        <span className="flex justify-between items-end">
          <button
            onClick={handleClose}
            className="mt-4 px-3 py-1 bg-accent text-background rounded text-sm"
          >
            Save invoice changes
          </button>
          <p className="text-sm text-secondary text-center">
            Last Modified {formatDateWithTime(invoice.last_modified)}
          </p>
        </span>
      </DialogContent>
    </Dialog>
  )
}
