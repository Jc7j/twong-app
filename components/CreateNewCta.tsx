'use client'

import { useStore } from '@/hooks/stores/useStore'
import { createNewProperty } from '@/lib/supabase/propertyApi'
import { createInvoiceForProperty } from '@/lib/supabase/invoiceApi'
import { addSupplyItem } from '@/lib/supabase/suppliesApi'
import { usePropertiesStore } from '@/hooks/stores/usePropertiesStore'

export default function CreateNewCta({
  whichOne,
}: {
  whichOne: 'property' | 'invoice' | 'supplyItem'
}) {
  const { addNewInvoiceToProperty } = useStore()
  const { selectedPropertyId } = usePropertiesStore()

  async function handleCreateInvoice() {
    if (!selectedPropertyId) {
      alert('No property selected! Please select a property first.')
      return
    }

    try {
      const newInvoice = await createInvoiceForProperty(selectedPropertyId)
      addNewInvoiceToProperty(newInvoice, selectedPropertyId)
    } catch (error) {
      console.error('Failed to create invoice:', error)
    }
  }

  if (whichOne === 'property') {
    return (
      <button
        className="px-5 py-3 text-sm shadow border bg-accent text-background rounded-lg"
        onClick={createNewProperty}
      >
        Create New Property
      </button>
    )
  }

  if (whichOne === 'invoice') {
    return (
      <button
        className="px-5 py-3 text-sm shadow border bg-accent text-background rounded-lg w-full"
        onClick={handleCreateInvoice}
      >
        Create new invoice
      </button>
    )
  }

  if (whichOne === 'supplyItem') {
    return (
      <button
        className="px-5 py-3 text-sm shadow border bg-accent text-background rounded-lg"
        onClick={addSupplyItem}
      >
        Create new item
      </button>
    )
  }
}
