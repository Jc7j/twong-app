import { Invoice } from '@/lib/definitions'
import { create } from 'zustand'

export interface InvoicesStoreState {
  selectedInvoice: Invoice | null
  setSelectedInvoice: (invoice: Invoice) => void
}

export const useInvoicesStore = create<InvoicesStoreState>((set) => ({
  selectedInvoice: null,
  setSelectedInvoice: (invoice: Invoice) => set({ selectedInvoice: invoice }),
}))