import { create } from 'zustand'
import {
  fetchProperties,
  fetchPropertyById,
  updatePropertyDetails,
} from '@/lib/supabase/propertyApi'
import { Property } from '@/lib/definitions'

export interface PropertiesStoreState {
  selectedProperty: Property | null
  properties: Property[]
  setSelectedProperty: (propertyId: number) => void
  fetchProperties: () => Promise<void>
  fetchProperty: (propertyId: number) => void
  updatePropertyDetails: (
    propertyId: number,
    updates: Partial<Property>
  ) => Promise<void>
}

export const usePropertiesStore = create<PropertiesStoreState>((set, get) => ({
  selectedProperty: null,
  properties: [],

  setProperties: (properties: Property[]) => set({ properties }),

  setSelectedProperty: (propertyId) => {
    const { properties } = get()
    const selected = properties.find((p) => p.property_id === propertyId)

    if (selected && selected.invoices) {
      selected.invoices = selected.invoices
        .slice()
        .sort(
          (a, b) =>
            new Date(b.invoice_month).getTime() -
            new Date(a.invoice_month).getTime()
        )
    }

    set({ selectedProperty: selected })
  },

  fetchProperty: async (propertyId) => {
    const property = await fetchPropertyById(propertyId)
    property.invoices = property.invoices?.sort(
      (a, b) =>
        new Date(b.invoice_month).getTime() -
        new Date(a.invoice_month).getTime()
    )
    set({ selectedProperty: property })
  },

  fetchProperties: async () => {
    try {
      const properties = await fetchProperties()
      set({ properties })
    } catch (error) {
      console.error('Failed to fetch properties:', error)
    }
  },

  updatePropertyDetails: async (
    propertyId: number,
    updates: Partial<Property>
  ) => {
    try {
      await updatePropertyDetails(propertyId, updates)
      set((state) => {
        const updatedProperties = state.properties.map((p) =>
          p.property_id === propertyId ? { ...p, ...updates } : p
        )
        return { properties: updatedProperties }
      })
    } catch (error) {
      console.error('Failed to update property:', error)
    }
  },
}))
