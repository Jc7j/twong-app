import { DeleteDialogOpen, DialogOpen } from '@/lib/definitions'
import { create } from 'zustand'

export const useDialogNewPropertyOpen = create<DialogOpen>((set) => ({
  open: false,
  setOpen: (open: DialogOpen['open']) => set({ open }),
}))

export const useDialogInvoiceOpen = create<DialogOpen>((set) => ({
  open: false,
  setOpen: (open: DialogOpen['open']) => set({ open }),
}))

export const useDialogNewSupplyOpen = create<DialogOpen>((set) => ({
  open: false,
  setOpen: (open: DialogOpen['open']) => set({ open }),
}))

export const useDeleteModalOpen = create<DeleteDialogOpen>((set) => ({
  deleteOpen: false,
  setDeleteOpen: (deleteOpen: DialogOpen['open']) => set({ deleteOpen }),
}))
