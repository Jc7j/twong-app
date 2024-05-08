'use client'

import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog'
import { addSupplyItem, fetchAllSupplyItems } from '@/lib/supabase/suppliesApi'
import { useState } from 'react'

interface NewPropertyModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export default function NewSupplyModal({
  isOpen,
  onOpenChange,
}: NewPropertyModalProps) {
  const [itemName, setItemName] = useState('')
  const [price, setPrice] = useState(0)
  const [qtyPerPackage, setQtyPerPackage] = useState(1)
  const [link, setLink] = useState('')

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    await addSupplyItem(itemName, price, qtyPerPackage, link)
    await fetchAllSupplyItems()
    setItemName('')
    setPrice(0)
    setQtyPerPackage(1)
    setLink('')
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSave}>
          <p className="text-lg font-medium">Item Name</p>
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            required
            className="form-input px-2 py-1 rounded border mt-1 w-full "
          />

          <p className="text-lg font-medium">Price</p>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            required
            className="form-input px-2 py-1 rounded border mt-1 w-full "
          />

          <p className="text-lg font-medium">Qty Per Package</p>
          <input
            type="number"
            value={qtyPerPackage}
            onChange={(e) => setQtyPerPackage(parseInt(e.target.value))}
            required
            className="form-input px-2 py-1 rounded border mt-1 w-full "
          />

          <p className="text-lg font-medium">Link</p>
          <input
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="form-input px-2 py-1 rounded border mt-1 w-full "
          />
          <DialogFooter>
            <button
              type="submit"
              className="mt-4 px-3 py-1 bg-accent text-background rounded text-sm"
            >
              Save
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
