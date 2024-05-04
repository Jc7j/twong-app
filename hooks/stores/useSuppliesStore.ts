import { create } from 'zustand'
import {
  fetchSupplyItems,
  addSupplyItem,
  updateSupplyItem,
  deleteSupplyItem,
} from '@/lib/supabase/suppliesApi'
import { SupplyItem } from '@/lib/definitions'

type SupplyStoreState = {
  supplyItems: SupplyItem[]
  currentPage: number
  itemsPerPage: number
  setSupplyItems: (items: SupplyItem[]) => void
  setCurrentPage: (page: number) => void
  loadSupplyItems: (page: number) => Promise<void>
  moreAvailable: boolean
  setMoreAvailable: (moreAvailable: boolean) => void
  addSupplyItem: (item: SupplyItem) => Promise<void>
  updateSupplyItem: (
    supply_id: number,
    updates: Partial<SupplyItem>
  ) => Promise<void>
  deleteSupplyItem: (supply_id: number) => Promise<void>
}

export const useSupplyStore = create<SupplyStoreState>((set, get) => ({
  supplyItems: [],
  currentPage: 0,
  itemsPerPage: 30,
  moreAvailable: true,
  setMoreAvailable: (moreAvailable: boolean) => set({ moreAvailable }),

  setSupplyItems: (items: SupplyItem[]) => set({ supplyItems: items }),
  setCurrentPage: (page: number) => {
    set({ currentPage: page })
  },

  loadSupplyItems: async (page: number) => {
    const { itemsPerPage } = get()
    try {
      const items = await fetchSupplyItems(page, itemsPerPage)
      const moreAvailable = items.length === itemsPerPage
      set({
        supplyItems: items || [],
        moreAvailable,
      })
    } catch (error) {
      console.error('Failed to fetch items:', error)
    }
  },

  addSupplyItem: async (item: SupplyItem) => {
    try {
      const data = await addSupplyItem(item)
      if (data) {
        set({ supplyItems: [...get().supplyItems, data[0]] })
      }
    } catch (error) {
      console.error(error)
    }
  },

  updateSupplyItem: async (supply_id: number, updates: Partial<SupplyItem>) => {
    try {
      const data = await updateSupplyItem(supply_id, updates)
      if (data) {
        const newItems = get().supplyItems.map((item) =>
          // @ts-ignore its an object, but we need to fix typing for the supabase stuff though
          item.supply_id === supply_id ? { ...item, ...data } : item
        )
        set({ supplyItems: newItems })
      }
    } catch (error) {
      console.error(error)
    }
  },

  deleteSupplyItem: async (supply_id: number) => {
    try {
      await deleteSupplyItem(supply_id)
      const filteredItems = get().supplyItems.filter(
        (item) => item.supply_id !== supply_id
      )
      set({ supplyItems: filteredItems })
    } catch (error) {
      console.error(error)
    }
  },
}))
