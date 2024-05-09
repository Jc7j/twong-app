'use client'

import clsx from 'clsx'
import React, { useState, useEffect } from 'react'
import { useSupplyStore } from '@/hooks/stores/useSuppliesStore'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import { SupplyItem } from '@/lib/definitions'
import { EditModeToggle } from '../EditModeToggle'
import { EditableField } from '../EditableField'
import NewSupplyModal from './NewSupplyModal'
import { useDeleteModalOpen, useDialogNewSupplyOpen } from '@/hooks/useDialogOpen'
import DeleteSupplyItemModal from '../DeleteSupplyItemModal'

export default function SuppliesView() {
  const {
    supplyItems,
    fetchPaginatedSupplyItems,
    updateSupplyItem,
    currentPage,
    setCurrentPage,
    moreAvailable,
  } = useSupplyStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editableItems, setEditableItems] = useState<SupplyItem[]>([])
  const { open, setOpen } = useDialogNewSupplyOpen()
  const {deleteOpen, setDeleteOpen} = useDeleteModalOpen()
  const [supplyId, setSupplyId] = useState(0)

  useEffect(() => {
    if (supplyItems.length === 0) {
      fetchPaginatedSupplyItems(currentPage)
    }
    setEditableItems(supplyItems)
  }, [supplyItems, fetchPaginatedSupplyItems, currentPage])

  useEffect(() => {
    fetchPaginatedSupplyItems(currentPage)
  }, [currentPage])

  function handleEditField(
    index: number,
    field: keyof SupplyItem,
    value: string
  ) {
    const updatedItems = [...editableItems]
    updatedItems[index] = { ...updatedItems[index], [field]: value }
    setEditableItems(updatedItems)
  }

  async function handleSave() {
    const updatePromises = editableItems.map((item) =>
      updateSupplyItem(item.supply_id, {
        name: item.name,
        link: item.link,
        price: parseFloat(item.price as unknown as string),
        qty_per_package: parseInt(item.qty_per_package as unknown as string),
      })
    )

    try {
      await Promise.all(updatePromises)
      setIsEditing(false)
      await fetchPaginatedSupplyItems(currentPage)
    } catch (error) {
      console.error('Failed to save updates:', error)
    }
  }

  function handleDelete(supply_id: number) {
    setDeleteOpen(true)
    setSupplyId(supply_id)
  }

  function handleNextPage() {
    setCurrentPage(currentPage + 1)
  }
  function handlePrevPage() {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <section className="mt-8">
      <NewSupplyModal isOpen={open} onOpenChange={setOpen} />
      <DeleteSupplyItemModal isOpen={deleteOpen} onOpenChange={setDeleteOpen} supplyId={supplyId}/>
      <button
        className="px-5 py-3 text-sm shadow border bg-accent text-background rounded-lg  truncate"
        onClick={() => setOpen(true)}
      >
        Create new Item
      </button>
      <span className="flex mt-4 mb-2">
        <EditModeToggle
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          handleSave={handleSave}
        />
        <div className="ml-8">
          <button
            onClick={handlePrevPage}
            className={clsx(
              'text-accent underline underline-offset-2 text-sm mr-3',
              currentPage === 0 && 'text-secondary'
            )}
            disabled={currentPage === 0}
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            className={clsx(
              'text-accent underline underline-offset-2 text-sm',
              !moreAvailable && 'text-secondary'
            )}
            disabled={!moreAvailable}
          >
            Next
          </button>
        </div>
      </span>
      <div className="rounded-2xl border p-4 w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="flex w-full">
              <TableHead className="flex-grow flex-shrink w-1/5">
                Name
              </TableHead>
              <TableHead className="flex-grow flex-shrink w-1/5 text-center">
                Price
              </TableHead>
              <TableHead className="flex-grow flex-shrink w-1/5 text-center">
                Qty Per Package
              </TableHead>
              {isEditing && (
                <TableHead className="flex-grow flex-shrink w-1/5 text-center">
                  Link
                </TableHead>
              )}
              {isEditing && (
                <TableHead className="flex-grow flex-shrink w-1/5 text-right">
                  {''}
                </TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {editableItems.map((item, index) => (
              <TableRow
                key={item.supply_id}
                className="flex w-full items-end py-2"
              >
                <TableCell className="flex-grow w-1/5 truncate">
                  {item.link ? (
                    <a
                      className="text-accent underline underline-offset-2"
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <EditableField
                        value={item.name}
                        onChange={(value: string) =>
                          handleEditField(index, 'name', value)
                        }
                        isEditing={isEditing}
                        as="div"
                      />
                    </a>
                  ) : (
                    <EditableField
                      value={item.name}
                      onChange={(value: string) =>
                        handleEditField(index, 'name', value)
                      }
                      isEditing={isEditing}
                      as="div"
                    />
                  )}
                </TableCell>
                <TableCell className="flex-grow w-1/5 truncate text-center">
                  <EditableField
                    value={item.price.toString()}
                    onChange={(value: string) =>
                      handleEditField(index, 'price', value)
                    }
                    isEditing={isEditing}
                    as="div"
                  />
                </TableCell>
                <TableCell className="flex-grow w-1/5 truncate text-center">
                  <EditableField
                    value={item.qty_per_package.toString()}
                    onChange={(value: string) =>
                      handleEditField(index, 'qty_per_package', value)
                    }
                    isEditing={isEditing}
                    as="div"
                  />
                </TableCell>
                {isEditing && (
                  <TableCell className="flex-grow w-1/5 truncate text-center">
                    <EditableField
                      value={item.link || ''}
                      onChange={(value: string) =>
                        handleEditField(index, 'link', value)
                      }
                      isEditing={isEditing}
                      as="div"
                    />
                  </TableCell>
                )}
                {isEditing && (
                  <TableCell className="flex-grow w-1/5 truncate text-right">
                    <button
                      onClick={() => handleDelete(item.supply_id)}
                      className="text-accent underline underline-offset-2 text-sm"
                    >
                      delete
                    </button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  )
}
