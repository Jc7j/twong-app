'use client'

import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDateWithDay } from '@/lib/utils'
import { Property } from '@/lib/definitions'
import { usePropertiesStore } from '@/hooks/stores/usePropertiesStore'
import { useDialogNewPropertyOpen } from '@/hooks/useDialogOpen'
import NewPropertyModal from './NewPropertyModal'
import InvoicesPDF from './InvoicesPDF'

function PropertiesView() {
  const { properties, fetchProperties, selectedProperty, setSelectedProperty } =
    usePropertiesStore()
  const { open, setOpen } = useDialogNewPropertyOpen()
  const [searchTerm, setSearchTerm] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    if (properties.length === 0) {
      fetchProperties()
    }
  }, [properties.length, fetchProperties])

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.target.value)
  }

  const filteredProperties = properties.filter((property) =>
    property.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <section className="md:w-7/12 md:mr-8 mt-8 md:mt-0">
      <InvoicesPDF isOpen={dialogOpen} onOpenChange={setDialogOpen} />
      <span className="flex items-center justify-between gap-4">
        <span className="input flex items-center border border-accent rounded-full px-4 py-3">
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0 w-4 h-4 mr-2"
          >
            <g clipPath="url(#clip0_23922_1020)">
              <path
                d="M13.125 13.125L9.37506 9.375M10.625 6.25C10.625 8.66625 8.66625 10.625 6.25 10.625C3.83375 10.625 1.875 8.66625 1.875 6.25C1.875 3.83375 3.83375 1.875 6.25 1.875C8.66625 1.875 10.625 3.83375 10.625 6.25Z"
                stroke="#AAB7B8"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_23922_1020">
                <rect width="15" height="15" fill="white" />
              </clipPath>
            </defs>
          </svg>

          <input
            type="text"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="flex-grow border-none outline-none bg-inherit truncate"
          />
        </span>
        <button
          onClick={() => setDialogOpen(true)}
          className="flex gap-1 items-center text-accent"
        >
          {
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="md:hidden"
            >
              <path
                d="M14 10V10.8C14 11.9201 14 12.4802 13.782 12.908C13.5903 13.2843 13.2843 13.5903 12.908 13.782C12.4802 14 11.9201 14 10.8 14H5.2C4.07989 14 3.51984 14 3.09202 13.782C2.71569 13.5903 2.40973 13.2843 2.21799 12.908C2 12.4802 2 11.9201 2 10.8V10M11.3333 6.66667L8 10M8 10L4.66667 6.66667M8 10V2"
                stroke="#57604B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }{' '}
          <p className="hidden md:inline">Download invoices</p>
        </button>
        <button
          className="flex items-center gap-1 px-5 py-4 text-sm shadow border bg-accent font-medium text-background rounded-lg md:w-auto truncate"
          onClick={() => setOpen(true)}
        >
          {
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 10.0001L14 6.00006M2.5 21.5001L5.88437 21.124C6.29786 21.0781 6.5046 21.0551 6.69785 20.9925C6.86929 20.937 7.03245 20.8586 7.18289 20.7594C7.35245 20.6476 7.49955 20.5005 7.79373 20.2063L21 7.00006C22.1046 5.89549 22.1046 4.10463 21 3.00006C19.8955 1.89549 18.1046 1.89549 17 3.00006L3.79373 16.2063C3.49955 16.5005 3.35246 16.6476 3.24064 16.8172C3.14143 16.9676 3.06301 17.1308 3.00751 17.3022C2.94496 17.4955 2.92198 17.7022 2.87604 18.1157L2.5 21.5001Z"
                stroke="#F9FAFB"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }{' '}
          {/* <p className="hidden md:inline">Create Property</p> */}
        </button>
      </span>

      <div className="rounded-2xl border p-4 mt-8">
        <Table>
          <TableHeader>
            <TableRow className="flex w-full text-base">
              <TableHead className="flex-grow flex-shrink w-1/3 text-center">
                Name
              </TableHead>
              <TableHead className="flex-grow flex-shrink w-1/3 text-center">
                Last Modified
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredProperties?.map((property: Property) => (
              <TableRow
                className={clsx(
                  'flex w-full text-primary transition-colors hover:bg-accent py-2',
                  selectedProperty?.property_id === property.property_id &&
                    'bg-accent text-background font-medium shadow-inner'
                )}
                key={property.property_id}
                onClick={() => setSelectedProperty(property.property_id)}
              >
                <TableCell className="flex-grow flex-shrink w-1/3 text-center">
                  {property.name}
                </TableCell>
                <TableCell className="flex-grow flex-shrink w-1/3 text-center">
                  {property.invoices &&
                  property.invoices.length > 0 &&
                  property.invoices[0].last_modified
                    ? formatDateWithDay(property.invoices[0].last_modified)
                    : 'No data'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <NewPropertyModal isOpen={open} onOpenChange={setOpen} />
    </section>
  )
}

export default React.memo(PropertiesView)
