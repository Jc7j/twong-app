'use client'

import clsx from 'clsx'
import React, { useCallback, useEffect } from 'react'
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

function PropertiesView() {
  const {
    properties,
    fetchProperties,
    selectedPropertyId,
    setSelectedPropertyId,
  } = usePropertiesStore()

  const handleRowClick = useCallback(
    (propertyId: number) => {
      setSelectedPropertyId(propertyId)
    },
    [setSelectedPropertyId]
  )

  useEffect(() => {
    if (properties.length === 0) {
      fetchProperties()
    }
  }, [properties.length, fetchProperties])

  return (
    // mr-8 because dunno how to do in page.tsx
    <section className="rounded-2xl border p-4 md:w-7/12 mr-8">
      <Table>
        <TableHeader>
          <TableRow className="flex w-full text-base">
            <TableHead className="flex-grow flex-shrink w-1/3">Name</TableHead>
            <TableHead className="flex-grow flex-shrink w-1/3 text-center">
              Last Modified
            </TableHead>
            <TableHead className="flex-grow flex-shrink w-1/3 text-right">
              That Month Total
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
                  ? formatDateWithDay(property.invoices[0].last_modified)
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
