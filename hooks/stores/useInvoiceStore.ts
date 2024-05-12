import { AppState, Invoice } from '@/lib/definitions'
import { fetchInvoices } from '@/lib/supabase/invoiceApi'
import { create } from 'zustand'

export interface InvoicesStoreState extends Partial<AppState> {
  selectedInvoice: Invoice | null
  invoices: any
  setSelectedInvoice: (invoice: Invoice) => void
  fetchInvoices: (date: Date) => void
}

export const useInvoicesStore = create<InvoicesStoreState>((set) => ({
  invoices: [],
  selectedInvoice: null,
  setSelectedInvoice: (invoice: Invoice) => set({ selectedInvoice: invoice }),
  fetchInvoices: async (date) => {
    const invoices = await fetchInvoices(date)
    set({ invoices })
  },
}))
