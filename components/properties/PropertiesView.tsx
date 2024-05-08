'use client'

import clsx from 'clsx'
import React, {  useEffect, useState } from 'react'
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
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (properties.length === 0) {
      fetchProperties()
    }
  }, [properties.length, fetchProperties])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredProperties = properties.filter(property =>
    property.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <section className="md:w-7/12 md:mr-8 mt-8 md:mt-0">
      <span className="flex items-center justify-between gap-4">
      <input
            type="text"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="px-4 py-2 border border-accent rounded-lg w-2/3"
          />
        <button
          className="px-5 py-3 text-sm shadow border bg-accent text-background rounded-lg w-1/3 truncate"
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
                  'flex w-full text-primary transition-colors hover:bg-accent',
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
