'use client'

import { useEffect, useState } from 'react'
import { usePropertiesStore } from '@/hooks/stores/usePropertiesStore'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function PropertyMonthInvoiceTable() {
  const { properties, fetchProperties } = usePropertiesStore()
  const [inputValue, setInputValue] = useState<string>('')
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const dateRegex = /^(0[1-9]|1[0-2])\/\d{4}$/

    if (dateRegex.test(inputValue)) {
      const [month, year] = inputValue.split('/')
      const date = new Date(parseInt(year), parseInt(month) - 1)
      setSelectedMonth(date)
      setError(null)
    } else {
      setError('Invalid date format. Please use MM/YYYY format.')
      setSelectedMonth(null)
    }
  }

  const filteredProperties = properties.map((property) => {
    const filteredInvoices = property.invoices?.filter((invoice) => {
      const invoiceDate = new Date(invoice.invoice_month)
      return (
        selectedMonth &&
        invoiceDate.getMonth() === selectedMonth.getMonth() &&
        invoiceDate.getFullYear() === selectedMonth.getFullYear()
      )
    })
    return {
      ...property,
      invoices: filteredInvoices,
    }
  })

  const totals = filteredProperties.reduce(
    (acc, property) => {
      property.invoices?.forEach((invoice) => {
        const invoiceItemsTotal = invoice.invoiceItems?.reduce(
          (total, item) => total + item.quantity * item.price_at_creation,
          0
        )
        acc.management_fee += invoice.management_fee
        acc.invoiceItemsTotal += invoiceItemsTotal || 0
        acc.invoice_total += invoice.total
      })
      return acc
    },
    { management_fee: 0, invoiceItemsTotal: 0, invoice_total: 0 }
  )

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="MM/YYYY"
            className="border p-2 rounded-lg"
          />
          <button
            type="submit"
            className="ml-8 px-5 py-3 text-sm shadow border bg-accent font-medium text-background rounded-lg truncate"
          >
            Select Month
          </button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
      <Table className="min-w-full bg-white">
        <TableHeader>
          <TableRow>
            <TableHead className="py-2 px-4 border">Property Name</TableHead>
            <TableHead className="py-2 px-4 border">Management Fee</TableHead>
            <TableHead className="py-2 px-4 border">Supplies/Repairs</TableHead>
            <TableHead className="py-2 px-4 border">Invoice Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="py-2 px-4 border font-bold">Total</TableCell>
            <TableCell className="py-2 px-4 border font-bold">${totals.management_fee.toFixed(2)}</TableCell>
            <TableCell className="py-2 px-4 border font-bold">${totals.invoiceItemsTotal.toFixed(2)}</TableCell>
            <TableCell className="py-2 px-4 border font-bold">${totals.invoice_total.toFixed(2)}</TableCell>
          </TableRow>
          {filteredProperties.map((property) =>
            property.invoices?.map((invoice) => {
              const invoiceItemsTotal = invoice.invoiceItems?.reduce(
                (total, item) => total + item.quantity * item.price_at_creation,
                0
              )

              return (
                <TableRow key={invoice.invoice_id}>
                  <TableCell className="py-2 px-4 border">
                    {property.name}
                  </TableCell>
                  <TableCell className="py-2 px-4 border">
                    ${invoice.management_fee.toFixed(2)}
                  </TableCell>
                  <TableCell className="py-2 px-4 border">
                    ${invoiceItemsTotal?.toFixed(2)}
                  </TableCell>
                  <TableCell className="py-2 px-4 border">
                    ${invoice.total.toFixed(2)}
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
