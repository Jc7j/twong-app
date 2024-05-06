'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from '@/components/ui/dialog'
import { createNewProperty } from '@/lib/supabase/propertyApi'
import { usePropertiesStore } from '@/hooks/stores/usePropertiesStore'

interface NewPropertyModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export default function NewPropertyModal({
  isOpen,
  onOpenChange,
}: NewPropertyModalProps) {
  const {fetchProperties} = usePropertiesStore()
  const [propertyName, setPropertyName] = useState('')
  const [houseAddress, setHouseAddress] = useState('')

  async function handleSave (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    await createNewProperty({name: propertyName, address: houseAddress})
    await fetchProperties()
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSave}>
          <p>Property Name</p>
          <input
            type="text"
            value={propertyName}
            defaultValue={'...'}
            onChange={(e) => setPropertyName(e.target.value)}
            required
            className="form-input px-2 py-1 rounded border mt-1 w-full"
          />

          <p>House Address</p>
          <input
            type="text"
            value={houseAddress}
            defaultValue={'...'}
            onChange={(e) => setHouseAddress(e.target.value)}
            required
            className="form-input px-2 py-1 rounded border mt-1 w-full"
          />

          <DialogFooter>
            <button type="submit" className="mt-4 px-3 py-1 bg-accent text-background rounded text-sm">
              Save
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
