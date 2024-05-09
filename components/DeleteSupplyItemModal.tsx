'use client'

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog'
import { useSupplyStore } from '@/hooks/stores/useSuppliesStore'
import {
  deleteSupplyItem,
  fetchPaginatedSupplyItems,
} from '@/lib/supabase/suppliesApi'

interface DeleteModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  supplyId: number
}

export default function DeleteSupplyItemModal({
  isOpen,
  onOpenChange,
  supplyId,
}: DeleteModalProps) {
  const { fetchPaginatedSupplyItems, deleteSupplyItem, currentPage } =
    useSupplyStore()
  console.log('delete supplyId', supplyId)

  async function handleDelete() {
    await deleteSupplyItem(supplyId)
    await fetchPaginatedSupplyItems(currentPage)
    supplyId = 0
    onOpenChange(false)
  }

  console.log('hello')
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Are you sure?</DialogTitle>
        <span>
          <button
            className='px-5 py-3 text-sm shadow border bg-accent text-background rounded-lg  truncate"'
            onClick={() => onOpenChange(false)}
          >
            No
          </button>
          <button
            className="border-accent border px-5 py-3 text-sm rounded-lg "
            onClick={handleDelete}
          >
            Delete
          </button>
        </span>
        {/* <button onClick={handleDelete}>close</button> */}
      </DialogContent>
    </Dialog>
  )
}
