'use client'

import clsx from 'clsx'
import React, { useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useStore } from '@/hooks/stores/useStore'
import { Property } from '@/lib/definitions'

function PropertiesView() {
  const {
    properties,
    fetchProperties,
    selectedPropertyId,
    setSelectedPropertyId,
  } = useStore()

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  const formatDate = (dateString: Date): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const handleRowClick = (propertyId: number) => {
    setSelectedPropertyId(propertyId)
  }

  console.log(properties)
  return (
    <section className="rounded-2xl border p-4 md:w-7/12">
      <Table>
        <TableHeader>
          <TableRow className="flex w-full">
            <TableHead className="flex-grow flex-shrink w-1/3">Name</TableHead>
            <TableHead className="flex-grow flex-shrink w-1/3 text-center">
              Last Modified
            </TableHead>
            <TableHead className="flex-grow flex-shrink w-1/3 text-right">
              Last Modified Month Total
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {properties?.map((property: Property) => (
            <TableRow
              className={clsx(
                'flex w-full text-primary transition-colors hover:bg-accent',
                selectedPropertyId === property.property_id &&
                  'bg-accent text-background font-medium'
              )}
              key={property.property_id}
              onClick={() => handleRowClick(property.property_id)}
            >
              <TableCell className="flex-grow flex-shrink w-1/3">
                {property.name}
              </TableCell>
              <TableCell className="flex-grow flex-shrink w-1/3 text-center">
                {property.invoices &&
                property.invoices.length > 0 &&
                property.invoices[0].last_modified
                  ? formatDate(property.invoices[0].last_modified)
                  : 'No data'}
              </TableCell>
              <TableCell className="flex-grow flex-shrink w-1/3 text-right">
                {property.invoices && property.invoices.length > 0
                  ? `$${property.invoices[0].total}`
                  : 'No data'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  )
}

export default React.memo(PropertiesView)
