import { create } from 'zustand'
import { supabase } from '@/lib/supabase/server'
import { AppState, Property } from '@/lib/definitions'

interface StoreState extends AppState {
  selectedPropertyId: number | null
  setSelectedPropertyId: (propertyId: number | null) => void
}

export const useStore = create<StoreState>((set) => ({
  properties: [],
  selectedPropertyId: null,

  setProperties: (properties: Property[]) => set({ properties }),

  setSelectedPropertyId: (propertyId: number | null) =>
    set({ selectedPropertyId: propertyId }),

  fetchProperties: async () => {
    const { data: properties, error } = await supabase.from('properties')
      .select(`
        *,
        owner:owners(*),
        invoices:invoices(*, invoiceItems:invoice_items(*, supplyItem:supply_items(*)))
      `)

    if (error) {
      console.error('Error fetching properties:', error)
      return
    }

    set({ properties })
  },
}))
