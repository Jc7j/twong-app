'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useInvoicesStore } from '@/hooks/stores/useInvoiceStore'
import { PDFDownloadLink } from '@react-pdf/renderer'
import React, { useState } from 'react'
import { GeneratedPDF } from './GeneratedPDF'

interface InvoicePDFProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export default function InvoicesPDF({ isOpen, onOpenChange }: InvoicePDFProps) {
  const [inputValue, setInputValue] = useState('')
  const { invoices, fetchInvoices } = useInvoicesStore()

  const [selectedDate, setSelecteDate] = useState<Date | null>(null)

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const dateRegex = /^(0[1-9]|1[0-2])\/\d{4}$/

    if (dateRegex.test(inputValue)) {
      const [month, year] = inputValue.split('/')
      const date = new Date(parseInt(year), parseInt(month) - 1)
      setSelecteDate(date)
      try {
        fetchInvoices(date)
      } catch (error) {
        console.error('Error fetching invoices:', error)
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <form className="flex gap-8" onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="MM/YYYY"
            className="px-2"
          />
          <button
            className="w-full py-3 text-sm shadow border bg-accent font-medium text-background rounded-lg"
            type="submit"
          >
            Generate Invoices
          </button>
        </form>

        {invoices.length > 0 && (
          <PDFDownloadLink
            document={<GeneratedPDF invoices={invoices} />}
            fileName={`invoices_${selectedDate}.pdf`}
          >
            Download
          </PDFDownloadLink>
        )}
      </DialogContent>
    </Dialog>
  )
}
