'use client'

import React, { useEffect, useState } from 'react'
import { Invoice, InvoiceItem, Property } from '@/lib/definitions'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogOverlay,
} from '@/components/ui/dialog'
import {
  calculateTotalWithTax,
  formatDate,
  formatDateToISO,
  formatDateWithTime,
  numToFixedFloat,
} from '@/lib/utils'
import {
  addInvoiceItem,
  deleteInvoice,
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
import DeletePopup from '../DeletePopup'
import MaintenanceLabel from '../MaintenanceLabel'

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
  const [selectedSupplyId, setSelectedSupplyId] = useState<number | null>(
    supplyItems.length ? supplyItems[0].supply_id : null
  )
  const [quantity, setQuantity] = useState(1)
  const [invoiceItems, setInvoiceItems] = useState(invoice.invoiceItems)
  const [stagedItems, setStagedItems] = useState<InvoiceItem[]>([])
  const [editedManagementFee, setEditedManagementFee] = useState<number>(
    invoice.management_fee
  )
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isOtherSelected, setIsOtherSelected] = useState(false)
  const [otherValue, setOtherValue] = useState({ name: '', price: 0 })

  useEffect(() => {
    const formattedMonth = formatDate(new Date(invoice.invoice_month))
    setEditedMonth(formattedMonth)
    setEditedManagementFee(invoice.management_fee)
    setSelectedSupplyId(supplyItems.length ? supplyItems[0].supply_id : null)
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
          editedManagementFee,
          invoice.total
        )
      }
      for (const item of stagedItems) {
        if (item.quantity > 0) {
          await addInvoiceItem(
            invoice.invoice_id,
            item.name || otherValue.name,
            item.quantity,
            item.price_at_creation || otherValue.price,
            item.name ? false : true // Set is_maintenance to true for otherValue
          )
        }
      }
      await fetchProperty(selectedProperty?.property_id as number)
      setEditedManagementFee(0)
      setOtherValue({ name: '', price: 0 })
      setIsOtherSelected(false)
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
        invoice_id: invoice.invoice_id,
        supply_id: selectedSupplyId as number,
        quantity,
        name: supplyItems.find((item) => item.supply_id === selectedSupplyId)
          ?.name,
        price_at_creation: supplyItems.find(
          (item) => item.supply_id === selectedSupplyId
        )?.price,
        supplyItem: supplyItems.find(
          (item) => item.supply_id === selectedSupplyId
        ),
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
        const originalItem = invoice.invoiceItems.find(
          (i) => i.item_id === item.item_id
        )

        // Check if the item should be updated or deleted
        if (originalItem) {
          if (item.quantity === 0) {
            // Delete the item if the quantity is zero
            await deleteInvoiceItem(item.item_id)
          } else if (item.quantity !== originalItem.quantity) {
            // Update the item only if the quantity has changed and is not zero
            await updateInvoiceItemQuantity(item.item_id, item.quantity)
          }
        }
      }
    } else {
      console.warn('Invoice items data is not available')
    }
    setIsEditingInvoiceItems(false)
  }

  function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = parseInt(e.target.value)
    setSelectedSupplyId(value)

    if (value === -1) {
      setIsOtherSelected(true)
    } else {
      setIsOtherSelected(false)
    }
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
    setIsOtherSelected(false)
    setOtherValue({ name: '', price: 0 })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DeletePopup
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
        id={invoice.invoice_id}
        deleteFn={() => deleteInvoice(invoice.invoice_id)}
        fetchFn={() => fetchProperty(selectedProperty.property_id)}
      />
      <DialogContent
        className={'lg:max-w-screen-sm overflow-y-auto max-h-screen'}
      >
        <DialogHeader>
          <h2 className="text-2xl font-medium">{property.name}</h2>
          <span className='flex items-end gap-2'>
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
        </DialogHeader>
        <hr />
        <div className="h-[250px] overflow-y-auto">
          <h3 className="text-xl text-center">Charges and Reimbursements</h3>
          <span className="flex justify-between font-normal">
            <p>Property Management Fee</p>
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
                key={item.item_id || index}
              >
                <span>
                  <EditableNumberField
                    value={item.quantity}
                    onChange={(value) => handleQuantityChange(index, value)}
                    isEditing={isEditingInvoiceItems}
                    className="inline text-sm mr-1 w-1/3"
                  />
                  <p className="max-w-36 trunacte inline mr-2">{item.name}</p>
                  {item.is_maintenance && <MaintenanceLabel />}
                </span>
                <p>
                  $
                  {numToFixedFloat(
                    (item.price_at_creation as number) * item.quantity
                  )}
                </p>
              </span>
            ))}
          <EditModeToggle
            isEditing={isEditingInvoiceItems}
            setIsEditing={setIsEditingInvoiceItems}
            handleSave={handleUpdatingInvoiceItems}
            editText="Edit items"
          />
          <hr className="mt-4" />
          <p className="text-accent font-medium text-center">Staged Items</p>
          {stagedItems.map((item, index) => (
            <div key={item.item_id || index} className="flex justify-between">
              <span>
                <p className="inline text-sm mr-1">x{item.quantity}</p>
                <p className="inline">{item.name || otherValue.name}</p>
              </span>
              {item.quantity && (
                <span>
                  $
                  {numToFixedFloat(
                    ((item.price_at_creation as number) || otherValue.price) *
                      item.quantity
                  )}
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
                    onChange={handleSelectChange}
                    className="border-accent truncate "
                    autoFocus
                  >
                    {supplyItems.map((item) => (
                      <option key={item.supply_id} value={item.supply_id}>
                        {item.name}
                      </option>
                    ))}
                    <option value={-1}>Other...</option>
                  </select>
                  {isOtherSelected && (
                    <>
                      <input
                        type="text"
                        value={otherValue.name}
                        onChange={(e) =>
                          setOtherValue({ ...otherValue, name: e.target.value })
                        }
                        placeholder="Please specify"
                        className="border-accent"
                      />
                      <input
                        type="number"
                        value={otherValue.price || 'Price'}
                        onChange={(e) =>
                          setOtherValue({
                            ...otherValue,
                            price: parseFloat(e.target.value),
                          })
                        }
                        placeholder="Price"
                        className="border-accent mt-1"
                      />
                    </>
                  )}
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
        <DialogFooter>
          <span className="flex justify-between items-end">
            <p className="text-xs text-primary">taxes (8.375%)</p>
            <p>
              $
              {invoice.invoiceItems &&
                calculateTotalWithTax(invoice.invoiceItems).toFixed(2)}
            </p>
          </span>
          <span className="flex justify-between items-end">
            <p className="text-xl mt-3">Total:</p>
            <p>${invoice.total}</p>
          </span>
        
        <hr className='my-5'/>
        <p className="text-sm text-secondary ">
          Last Modified {formatDateWithTime(invoice.last_modified)}
        </p>
        <span className="flex justify-between items-end mt-4">
          <button
            onClick={handleSave}
            className=" px-3 py-1 bg-accent font-medium text-background rounded text-sm"
          >
            Save changes
          </button>
          <button
            className="ml-2 text-sm text-secondary underline underline-offset-2 hover:text-accent transition"
            onClick={() => setDialogOpen(true)}
          >
            delete invoice
          </button>
        </span>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
