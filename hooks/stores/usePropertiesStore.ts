import { create } from 'zustand'
import {
  fetchProperties,
  updatePropertyDetails,
} from '@/lib/supabase/propertyApi'
import { Property } from '@/lib/definitions'

export interface PropertiesStoreState {
  properties: Property[]
  selectedPropertyId: number | null
  setSelectedPropertyId: (propertyId: number | null) => void
  fetchProperties: () => Promise<void>
  updatePropertyDetails: (
    propertyId: number,
    updates: Partial<Property>
  ) => Promise<void>
}

export const usePropertiesStore = create<PropertiesStoreState>((set) => ({
  properties: [],
  selectedPropertyId: null,

  setProperties: (properties: Property[]) => set({ properties }),

  setSelectedPropertyId: (propertyId: number | null) =>
    set({ selectedPropertyId: propertyId }),

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