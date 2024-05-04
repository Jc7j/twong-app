'use client'

import React from 'react'
import { useStore } from '@/hooks/stores/useStore'

export default function InvoiceView() {
  const { properties, selectedPropertyId } = useStore()
  const selectedProperty = properties.find(
    (p) => p.property_id === selectedPropertyId
  )

  if (!selectedProperty) return <div className='rounded-2xl border p-4 md:w-4/12'>Select a property to see invoices.</div>

  return (
    <section className="rounded-2xl border p-4 md:w-4/12">
      <h2 className="text-2xl font-medium">{selectedProperty.name}</h2>
      <div className="mt-5 text-primary text-sm">
        <p>{selectedProperty.owner?.name}</p>
        <p>{selectedProperty.address}</p>
        <p>{selectedProperty.owner?.email}</p>
        <p>{selectedProperty.owner?.phone_number}</p>
      </div>
    </section>
  )
}
