import { create } from 'zustand'
import { AppState } from '@/lib/definitions'
import { supabase } from '@/lib/supabase/server'

export const useStore = create<AppState>((set) => ({
  properties: [],

  setProperties: (properties) => set({ properties }),

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
