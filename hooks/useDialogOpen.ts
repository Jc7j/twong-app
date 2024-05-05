import { DialogOpen } from '@/lib/definitions'
import { create } from 'zustand'

export const useDialogOpen = create<DialogOpen>((set) => ({
  open: false,
  setOpen: (open: DialogOpen['open']) => set({ open }),
}))
