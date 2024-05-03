'use client'

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
import { AppState, Property } from '@/lib/definitions'

const PropertiesView: React.FC = () => {
  const { properties, fetchProperties } = useStore((state: AppState) => ({
    properties: state.properties,
    fetchProperties: state.fetchProperties,
  }))

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  const formatDate = (dateString: Date): string => {
    console.log('Date string', dateString)
    const date = new Date(dateString)
    console.log('parsed', date)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <section className="rounded-2xl border p-4 w-7/12">
      <Table>
        <TableHeader>
          <TableRow className="flex w-full">
            <TableHead className="flex-grow flex-shrink w-1/3">Name</TableHead>
            <TableHead className="flex-grow flex-shrink w-1/3 text-center">Last Modified</TableHead>
            <TableHead className="flex-grow flex-shrink w-1/3 text-right">Current Month Total</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {properties?.map((property: Property) => (
            <TableRow
              key={property.propertyId}
              className="flex w-full text-secondary"
            >
              <TableCell className="flex-grow flex-shrink w-1/3">{property.name}</TableCell>
              {property.invoices && (
                <TableCell className="flex-grow flex-shrink w-1/3 text-center">
                  {formatDate(property.invoices[0].lastModified)}
                </TableCell>
              )}
              <TableCell className="flex-grow flex-shrink w-1/3 text-right">
                {property.invoices
                  ?.reduce((total, invoice) => total + invoice.total, 0)
                  .toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  )
}

export default PropertiesView
