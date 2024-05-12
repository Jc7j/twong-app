import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

interface DeletePopupProps {
  fetchFn: () => void
  deleteFn: () => void
  id: number
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export default function DeletePopup({
  deleteFn,
  fetchFn,
  id,
  isOpen,
  onOpenChange,
}: DeletePopupProps) {
  function handleOnOpenChange() {
    onOpenChange(false)
  }

  async function handleDelete() {
    await deleteFn()
    await fetchFn()

    id = 0
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOnOpenChange}>
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
      </DialogContent>
    </Dialog>
  )
}
