'use client'

import React, { useState } from 'react'
import { useStore } from '@/hooks/stores/useStore'
import { updateOwnerDetails } from '@/lib/supabase/ownerApi'
import { Property } from '@/lib/definitions'
import EditableField from '../EditableField'
import EditModeToggle from '../EditModeToggle'
import CreateNewCta from '../CreateNewCta'
import InvoiceList from './InvoiceList'

interface InvoiceViewProps {
  properties: Property[]
  selectedPropertyId: number | null
}

export default function InvoiceView({
  properties,
  selectedPropertyId,
}: InvoiceViewProps) {
  const { updatePropertyDetails, fetchProperties } = useStore()

  const selectedProperty = properties.find(
    (p) => p.property_id === selectedPropertyId
  )

  const [isEditing, setIsEditing] = useState(false)

  const handleSave = async () => {
    setIsEditing(false)
    if (!selectedProperty || !selectedProperty.owner) return

    try {
      await updatePropertyDetails(selectedProperty.property_id, {
        name: selectedProperty.name,
        address: selectedProperty.address,
      })

      await updateOwnerDetails(selectedProperty.owner.owner_id, {
        name: selectedProperty.owner.name,
        email: selectedProperty.owner.email,
        phone_number: selectedProperty.owner.phone_number,
      })
      await fetchProperties()
    } catch (error) {
      console.error('Failed to update:', error)
    }
  }

  if (!selectedProperty) {
    return (
      <div className="rounded-2xl border p-4 md:w-5/12">
        Select a property to see invoices.
      </div>
    )
  }

  return (
    <section className="rounded-2xl border p-4 md:w-5/12">
      <EditableField
        value={selectedProperty.name ?? ''}
        onChange={(value) => (selectedProperty.name = value)}
        isEditing={isEditing}
        as="h1"
        className="text-2xl font-medium"
      />
      <div className="mt-5 text-primary ">
        <EditableField
          value={selectedProperty.owner?.name ?? ''}
          onChange={(value) => (selectedProperty.owner!.name = value)}
          isEditing={isEditing}
        />
        <EditableField
          value={selectedProperty.address}
          onChange={(value) => (selectedProperty.address = value)}
          isEditing={isEditing}
        />
        <EditableField
          value={selectedProperty.owner?.email ?? ''}
          onChange={(value) => (selectedProperty.owner!.email = value)}
          isEditing={isEditing}
        />
        <EditableField
          value={selectedProperty.owner?.phone_number ?? ''}
          onChange={(value) => (selectedProperty.owner!.phone_number = value)}
          isEditing={isEditing}
        />
      </div>
      <div className="text-right">
        <EditModeToggle
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          handleSave={handleSave}
        />
      </div>

      <div className="my-2">
        <CreateNewCta whichOne="invoice" />
      </div>
      <InvoiceList />
    </section>
  )
}
