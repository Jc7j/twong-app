'use client'

import React, { useEffect, useState } from 'react'
import { Invoice, InvoiceItem, Property } from '@/lib/definitions'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  formatDate,
  formatDateToISO,
  formatDateWithTime,
  numToFixedFloat,
} from '@/lib/utils'
import {
  addInvoiceItem,
  deleteInvoiceItem,
  updateInvoiceItemQuantity,
  updateInvoiceMonth,
  updateManagementFee,
} from '@/lib/supabase/invoiceApi'
import { EditableField } from '../EditableField'
import { EditModeToggle } from '../EditModeToggle'
import { monthYearSchema } from '@/lib/schemas'
import { usePropertiesStore } from '@/hooks/stores/usePropertiesStore'
import { useDialogInvoiceOpen } from '@/hooks/useDialogOpen'
import { useSupplyStore } from '@/hooks/stores/useSuppliesStore'
import { EditableNumberField } from '../EditableNumberField'

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
  const [isEditingInvoiceItems, setIsEditingInvoiceItems] = useState(false)
  const [addingItem, setAddingItem] = useState(false)
  const [editedMonth, setEditedMonth] = useState('')
  const [selectedSupplyId, setSelectedSupplyId] = useState<number | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [invoiceItems, setInvoiceItems] = useState(invoice.invoiceItems)
  const [stagedItems, setStagedItems] = useState<InvoiceItem[]>([])
  const [editedManagementFee, setEditedManagementFee] = useState<number>(
    invoice.management_fee
  )

  useEffect(() => {
    const formattedMonth = formatDate(new Date(invoice.invoice_month))
    setEditedMonth(formattedMonth)
    setEditedManagementFee(invoice.management_fee)
    setSelectedSupplyId(supplyItems[0].supply_id)
    setInvoiceItems(invoice.invoiceItems)
  }, [invoice, supplyItems])

  if (!selectedProperty) {
    return null
  }

  async function handleSave() {
    try {
      setIsEditing(false)
      if (invoice.management_fee != editedManagementFee) {
        await updateManagementFee(
          invoice.invoice_id,
          editedManagementFee
        )
      }
      // Save staged invoice items to the db
      for (const item of stagedItems) {
        if (item.quantity > 0) {
          await addInvoiceItem(
            invoice.invoice_id,
            item.supply_id,
            item.quantity
          )
        }
      }
      await fetchProperty(selectedProperty?.property_id as number)
      setEditedManagementFee(0)
      setStagedItems([])
      setOpen(false)
    } catch (error) {
      console.error('Error updating invoice:', error)
      alert('Failed to save changes: ' + error)
    }
  }

  async function handleOnSaveEditMonth() {
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
      } catch (error) {
        console.error('Error updating invoice:', error)
        alert('Failed to save changes: ' + error)
      }
    }
  }

  function handleAddItem() {
    const existingItemIndex = stagedItems.findIndex(
      (item) => item.supply_id === selectedSupplyId
    )

    if (existingItemIndex >= 0) {
      const newStagedItems = [...stagedItems]
      newStagedItems[existingItemIndex] = {
        ...newStagedItems[existingItemIndex],
        quantity: newStagedItems[existingItemIndex].quantity + quantity,
      }
      setStagedItems(newStagedItems)
    } else {
      const newItem = {
        item_id: Date.now(),
        invoice_id: invoice.invoice_id,
        supply_id: selectedSupplyId as number,
        quantity,
        supplyItem: supplyItems.find(
          (item) => item.supply_id === selectedSupplyId
        ),
        price_at_creation: supplyItems.find(
          (item) => item.supply_id === selectedSupplyId
        )
      }
      // @ts-ignore
      setStagedItems([...stagedItems, newItem])
    }

    setAddingItem(false)
  }

  const handleQuantityChange = (itemIndex: number, newQuantity: number) => {
    const updatedItems = invoiceItems?.map((item, index) => {
      if (index === itemIndex) {
        return { ...item, quantity: newQuantity }
      }
      return item
    })
    setInvoiceItems(updatedItems)
  }

  async function handleUpdatingInvoiceItems() {
    if (invoiceItems && invoice.invoiceItems) {
      for (const item of invoiceItems) {
        const originalItem = invoice.invoiceItems.find(i => i.item_id === item.item_id);
        
        // Check if the item should be updated or deleted
        if (originalItem) {
          if (item.quantity === 0) {
            // Delete the item if the quantity is zero
            await deleteInvoiceItem(item.item_id);
          } else if (item.quantity !== originalItem.quantity) {
            // Update the item only if the quantity has changed and is not zero
            await updateInvoiceItemQuantity(item.item_id, item.quantity);
          }
        }
      }
    } else {
      console.warn('Invoice items data is not available');
    }
    setIsEditingInvoiceItems(false);
  }

  function calculatedTaxPrice() {
    const invoiceTotal = invoice.total
    const invoiceManagementFee = invoice.management_fee
    const taxableAmount = invoiceTotal - invoiceManagementFee
    const nevadaTax = 0.08375
    const taxedAmount = taxableAmount * nevadaTax
    const finalAmount = (taxableAmount - taxedAmount) * nevadaTax
    return Math.ceil(finalAmount * 100) / 100
  }

  function handleOpenChange() {
    setAddingItem(false)
    setEditedMonth(formatDate(new Date(invoice.invoice_month)))
    setIsEditing(false)
    setIsEditingInvoiceItems(false)
    setIsEditingInvoiceItems(false)
    setStagedItems([])
    setInvoiceItems(invoice.invoiceItems)
    setEditedManagementFee(invoice.management_fee)
    setQuantity(1)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
              handleSave={handleOnSaveEditMonth}
            />
          </span>
          <div className="text-sm text-primary mt-4">
            <p>{property.owner?.name}</p>
            <p>{property.address}</p>
            <p>{property.owner?.email}</p>
            <p>{property.owner?.phone_number}</p>
          </div>
        </DialogHeader>
        <hr />
        <div className="h-[250px] overflow-y-auto ">
          <h3 className="text-xl font-medium">Charges and Reimbursements</h3>
          <span className="flex justify-between font-normal">
            <p className="">Property Management Fee</p>
            <span className="w-1/5 flex">
              $
              <input
                type="number"
                value={editedManagementFee || 0}
                className="text-right w-full"
                onChange={(e) =>
                  setEditedManagementFee(parseFloat(e.target.value))
                }
              />
            </span>
          </span>
          {invoiceItems &&
            invoiceItems.map((item, index) => (
              <span
                className="flex justify-between items-end"
                key={item.item_id}
              >
                <span>
                  <EditableNumberField
                    value={item.quantity}
                    onChange={(value) => handleQuantityChange(index, value)}
                    isEditing={isEditingInvoiceItems}
                    className="inline text-sm mr-1 w-1/3"
                  />
                  <p className="inline">{item.supplyItem?.name}</p>
                </span>
                <p>
                  $
                  {numToFixedFloat(item.price_at_creation as number) *
                    item.quantity}
                </p>
              </span>
            ))}
          <EditModeToggle
            isEditing={isEditingInvoiceItems}
            setIsEditing={setIsEditingInvoiceItems}
            handleSave={handleUpdatingInvoiceItems}
            editText="Edit invoice items"
          />
          {stagedItems.length > 0 && (
            <>
              <hr className="mt-4" />
              <p className="text-accent font-medium text-center">
                Staged Items
              </p>
            </>
          )}
          {stagedItems.map((item) => (
            <div key={item.item_id} className="flex justify-between">
              <span>
                <p className="inline text-sm mr-1">x{item.quantity}</p>
                <p className="inline">{item.supplyItem?.name}</p>
              </span>
              {item.quantity && (
                <span>
                  $
                  {numToFixedFloat(item.supplyItem?.price as number) ||
                    0 * item.quantity}
                </span>
              )}
            </div>
          ))}
          {addingItem ? (
            <>
              <div className="flex">
                <span className="w-1/3">
                  <p className="text-sm text-accent">Quantity:</p>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="w-2/4"
                  />
                </span>
                <span className="w-2/3">
                  <p className="text-sm text-accent">Item:</p>
                  <select
                    value={selectedSupplyId as number}
                    onChange={(e) =>
                      setSelectedSupplyId(parseInt(e.target.value))
                    }
                    className="border-accent truncate "
                    autoFocus
                  >
                    {supplyItems.map((item) => (
                      <option key={item.supply_id} value={item.supply_id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </span>
              </div>
              <button
                onClick={handleAddItem}
                className="mt-2 px-3 py-1 bg-accent text-background rounded text-sm"
              >
                save changes
              </button>
            </>
          ) : (
            <button
              className="mt-2 px-3 py-1 bg-accent text-background rounded text-sm"
              onClick={() => setAddingItem(true)}
            >
              add item +
            </button>
          )}
        </div>
        <hr className="mt-8" />
        <DialogFooter className="flex flex-col">
          <span className="flex justify-between items-end">
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
            onClick={handleSave}
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
