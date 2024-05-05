import React, { useState } from 'react'
import { Invoice } from '@/lib/definitions'
import { DetailedInvoiceView } from './DetailedInvoiceView'
import { formatDate } from '@/lib/utils'
import { useDialogOpen } from '@/hooks/useDialogOpen'
import { usePropertiesStore } from '@/hooks/stores/usePropertiesStore'

export function InvoiceList() {
  const { properties, selectedPropertyId } = usePropertiesStore()
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const { open, setOpen } = useDialogOpen()

  const selectedProperty = properties.find(
    (p) => p.property_id === selectedPropertyId
  )

  if (!selectedProperty || !selectedProperty.invoices) {
    return <p>No invoices available for this property.</p>
  }

  const handleInvoiceClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setOpen(true)
  }

  return (
    <div>
      <ul>
        {selectedProperty.invoices.map((invoice) => (
          <li
            key={invoice.invoice_id}
            className="flex justify-between text-black font-medium border-b border-black text-sm pb-1 cursor-pointer"
            onClick={() => handleInvoiceClick(invoice)}
          >
            {formatDate(invoice.invoice_month)}
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_23926_1920)">
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
          </li>
        ))}
      </ul>
      {selectedInvoice && (
        <DetailedInvoiceView
          invoice={selectedInvoice}
          property={selectedProperty}
          isOpen={open}
          onOpenChange={setOpen}
        />
      )}
    </div>
  )
}