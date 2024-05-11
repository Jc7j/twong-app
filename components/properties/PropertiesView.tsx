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

function PropertiesView() {
  const { properties, fetchProperties, selectedProperty, setSelectedProperty } =
    usePropertiesStore()
  const { open, setOpen } = useDialogNewPropertyOpen()
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (properties.length === 0) {
      fetchProperties()
    }
  }, [properties.length, fetchProperties])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const filteredProperties = properties.filter((property) =>
    property.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <section className="md:w-7/12 md:mr-8 mt-8 md:mt-0">
      <span className="flex items-center justify-between gap-4">
        <label className="input flex items-center border border-accent rounded-full md:w-1/3 px-4 py-3">
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
        </label>
        <button
          className="px-5 py-4 text-sm shadow border bg-accent font-medium text-background rounded-lg md:w-1/5 truncate"
          onClick={() => setOpen(true)}
        >
          Create New Property
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
                  'flex w-full text-primary transition-colors hover:bg-accent py-2 rounded-e-full',
                  selectedProperty?.property_id === property.property_id &&
                    'bg-accent text-background font-medium'
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
