import { create } from 'zustand'
import {
  updateSupplyItem,
  fetchPaginatedSupplyItems,
} from '@/lib/supabase/suppliesApi'
import { SupplyItem } from '@/lib/definitions'

type SupplyStoreState = {
  supplyItems: SupplyItem[]
  currentPage: number
  itemsPerPage: number
  setSupplyItems: (items: SupplyItem[]) => void
  setCurrentPage: (page: number) => void
  fetchPaginatedSupplyItems: (page: number) => Promise<void>
  moreAvailable: boolean
  setMoreAvailable: (moreAvailable: boolean) => void
  updateSupplyItem: (
    supply_id: number,
    updates: Partial<SupplyItem>
  ) => Promise<void>
}

export const useSupplyStore = create<SupplyStoreState>((set, get) => ({
  supplyItems: [],
  currentPage: 0,
  itemsPerPage: 15,
  moreAvailable: true,
  setMoreAvailable: (moreAvailable: boolean) => set({ moreAvailable }),

  setSupplyItems: (items: SupplyItem[]) => set({ supplyItems: items }),
  setCurrentPage: (page: number) => {
    set({ currentPage: page })
  },

  fetchPaginatedSupplyItems: async (page: number) => {
    const { itemsPerPage } = get()
    try {
      const items = await fetchPaginatedSupplyItems(page, itemsPerPage)
      const moreAvailable = items.length === itemsPerPage
      set({
        supplyItems: items || [],
        moreAvailable,
      })
    } catch (error) {
      console.error('Failed to fetch items:', error)
    }
  },

  updateSupplyItem: async (supply_id: number, updates: Partial<SupplyItem>) => {
    try {
      const data = await updateSupplyItem(supply_id, updates)
      if (data) {
        const newItems = get().supplyItems.map((item) =>
          item.supply_id === supply_id ? { ...item } : item
        )
        set({ supplyItems: newItems })
      }
    } catch (error) {
      console.error(error)
    }
  },
}))
