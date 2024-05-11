'use client'

import React, { useEffect, useState } from 'react'
import { updateOwnerDetails } from '@/lib/supabase/ownerApi'
import { EditableField } from '../EditableField'
import { EditModeToggle } from '../EditModeToggle'
import { usePropertiesStore } from '@/hooks/stores/usePropertiesStore'
import { Invoice } from '@/lib/definitions'
import { DetailedInvoiceView } from './DetailedInvoiceView'
import { formatDate } from '@/lib/utils'
import { useDialogInvoiceOpen } from '@/hooks/useDialogOpen'
import { useInvoicesStore } from '@/hooks/stores/useInvoiceStore'
import { createNewInvoice } from '@/lib/supabase/invoiceApi'
import { fetchAllSupplyItems } from '@/lib/supabase/suppliesApi'
import { useSupplyStore } from '@/hooks/stores/useSuppliesStore'
import { deleteProperty } from '@/lib/supabase/propertyApi'

export default function InvoiceView() {
  const {
    selectedProperty,
    updatePropertyDetails,
    fetchProperty,
    fetchProperties,
    setSelectedProperty,
  } = usePropertiesStore()
  const { setSupplyItems } = useSupplyStore()
  const { selectedInvoice, setSelectedInvoice } = useInvoicesStore()
  const { setOpen } = useDialogInvoiceOpen()

  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetchAllSupplyItems()
      setSupplyItems(res)
    }
    fetchData()
  }, [setSupplyItems])

  async function handleSave() {
    setIsEditing(false)
    if (!selectedProperty || !selectedProperty.owner) return

    if (selectedProperty.name === '') {
      try {
        await deleteProperty(selectedProperty.property_id)
        await fetchProperties()
        setSelectedProperty(0)
      } catch (error) {
        console.error('Failed to delete from DB', error)
      }
    } else {
      try {
        await updatePropertyDetails(selectedProperty.property_id, {
          name: selectedProperty.name,
          address: selectedProperty.address,
        })

        await updateOwnerDetails(selectedProperty.owner.owner_id, {
          name: selectedProperty.owner.name,
          email: selectedProperty.owner.email,
          phone_number: selectedProperty.owner.phone_number,
        })
        await fetchProperty(selectedProperty.property_id)
      } catch (error) {
        console.error('Failed to update:', error)
      }
    }
  }

  function handleInvoiceClick(invoice: Invoice) {
    setSelectedInvoice(invoice)
    setOpen(true)
  }

  async function handleCreateNewInvoiceClick() {
    if (!selectedProperty) {
      return
    }
    try {
      const newInvoice = await createNewInvoice(selectedProperty?.property_id)
      await fetchProperty(selectedProperty?.property_id as number)
      newInvoice && setSelectedInvoice(newInvoice)
      setOpen(true)
    } catch (error) {
      console.error('Failed to create new invoice: ', error)
    }
  }

  if (!selectedProperty) {
    return (
      <div className="flex justify-center items-center rounded-2xl border p-4 md:w-5/12">
        Select a property to see invoices.
      </div>
    )
  }

  return (
    <section className="rounded-2xl border p-4 md:w-5/12">
      <EditableField
        value={selectedProperty.name ?? ''}
        onChange={(value: string) => (selectedProperty.name = value)}
        isEditing={isEditing}
        as="h1"
        className="text-2xl font-medium"
      />
      <div className="mt-4 text-primary">
        <EditableField
          value={selectedProperty.owner?.name ?? ''}
          onChange={(value: string) => (selectedProperty.owner!.name = value)}
          isEditing={isEditing}
        />
        <EditableField
          value={selectedProperty.address}
          onChange={(value: string) => (selectedProperty.address = value)}
          isEditing={isEditing}
        />
        <EditableField
          value={selectedProperty.owner?.email ?? ''}
          onChange={(value: string) => (selectedProperty.owner!.email = value)}
          isEditing={isEditing}
        />
        <EditableField
          value={selectedProperty.owner?.phone_number ?? ''}
          onChange={(value: string) =>
            (selectedProperty.owner!.phone_number = value)
          }
          isEditing={isEditing}
        />
      </div>
      <div className="text-right mt-2">
        <EditModeToggle
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          handleSave={handleSave}
        />
      </div>

      <div className="my-2">
        <button
          className="w-full py-3 text-sm shadow border bg-accent font-medium text-background rounded-lg"
          onClick={handleCreateNewInvoiceClick}
        >
          Create new invoice
        </button>
      </div>
      <ul>
        {selectedProperty.invoices?.map((invoice) => (
          <li
            key={invoice.invoice_id}
            className="flex justify-between items-center mb-3 text-black font-medium border-b border-black text-sm pb-1 cursor-pointer w-full"
            onClick={() => handleInvoiceClick(invoice)}
          >
            <span className="flex items-center w-3/5">
              <p className="mr-2">{formatDate(invoice.invoice_month)}</p>
              {invoice.management_fee > 0 && (
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_23926_1920)">
                    <path
                      d="M3.75 3.75L6.5625 6.5625M3.75 3.75H1.875L1.25 1.875L1.875 1.25L3.75 1.875V3.75ZM12.0369 1.71313L10.3946 3.35539C10.1471 3.6029 10.0233 3.72666 9.97697 3.86936C9.93619 3.99489 9.93619 4.13011 9.97697 4.25564C10.0233 4.39834 10.1471 4.5221 10.3946 4.76961L10.5429 4.91789C10.7904 5.1654 10.9142 5.28916 11.0569 5.33553C11.1824 5.37631 11.3176 5.37631 11.4431 5.33553C11.5858 5.28916 11.7096 5.1654 11.9571 4.91789L13.4933 3.3817C13.6588 3.7843 13.75 4.22525 13.75 4.6875C13.75 6.58598 12.211 8.125 10.3125 8.125C10.0836 8.125 9.85996 8.10263 9.6436 8.05996C9.33976 8.00004 9.18784 7.97007 9.09574 7.97925C8.99783 7.98901 8.94957 8.00369 8.86282 8.05011C8.78122 8.09378 8.69936 8.17564 8.53564 8.33936L4.0625 12.8125C3.54473 13.3303 2.70527 13.3303 2.1875 12.8125C1.66973 12.2947 1.66973 11.4553 2.1875 10.9375L6.66064 6.46436C6.82436 6.30064 6.90622 6.21878 6.94989 6.13718C6.99631 6.05042 7.01099 6.00217 7.02075 5.90426C7.02993 5.81216 6.99996 5.66024 6.94004 5.3564C6.89737 5.14004 6.875 4.91638 6.875 4.6875C6.875 2.78902 8.41402 1.25 10.3125 1.25C10.9409 1.25 11.53 1.41864 12.0369 1.71313ZM7.50003 9.37497L10.9375 12.8124C11.4553 13.3302 12.2947 13.3302 12.8125 12.8124C13.3303 12.2947 13.3303 11.4552 12.8125 10.9374L9.98457 8.10956C9.78438 8.09062 9.58919 8.0545 9.40049 8.00271C9.15733 7.93597 8.89059 7.98441 8.71229 8.16271L7.50003 9.37497Z"
                      stroke="black"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_23926_1920">
                      <rect width="15" height="15" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              )}
            </span>
            <p className="w-2/5 text-right truncate">${invoice.total}</p>
          </li>
        ))}
      </ul>
      {selectedInvoice && (
        <DetailedInvoiceView
          invoice={selectedInvoice}
          property={selectedProperty}
        />
      )}
    </section>
  )
}
