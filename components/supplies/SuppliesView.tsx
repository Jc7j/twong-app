'use client'

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
import EditModeToggle from '../EditModeToggle'
import EditableField from '../EditableField'
import clsx from 'clsx'

export default function SuppliesView() {
  const {
    supplyItems,
    loadSupplyItems,
    updateSupplyItem,
    deleteSupplyItem,
    currentPage,
    setCurrentPage,
    moreAvailable,
  } = useSupplyStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editableItems, setEditableItems] = useState<SupplyItem[]>([])

  useEffect(() => {
    if (supplyItems.length === 0) {
      loadSupplyItems(currentPage)
    }
    setEditableItems(supplyItems)
  }, [supplyItems, loadSupplyItems, currentPage])

  useEffect(() => {
    loadSupplyItems(currentPage)
  }, [currentPage])

  const handleEditField = (
    index: number,
    field: keyof SupplyItem,
    value: string
  ) => {
    const updatedItems = [...editableItems]
    updatedItems[index] = { ...updatedItems[index], [field]: value }
    setEditableItems(updatedItems)
  }

const handleSave = async () => {
  const updatePromises = editableItems.map(item => updateSupplyItem(item.supply_id, {
    name: item.name,
    link: item.link,
    price: parseFloat(item.price as unknown as string),
    qty_per_package: parseInt(item.qty_per_package as unknown as string),
  }));

  try {
    await Promise.all(updatePromises);
    setIsEditing(false);
    await loadSupplyItems(currentPage);
  } catch (error) {
    console.error('Failed to save updates:', error);
  }
}


  const handleDelete = async (supply_id: number) => {
    await deleteSupplyItem(supply_id)
    await loadSupplyItems(currentPage)
  }

  const handleNextPage = () => setCurrentPage(currentPage + 1)
  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <section className="rounded-2xl border p-4 w-2/3 overflow-x-auto mt-8">
      <span className="flex justify-between">
        <EditModeToggle
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          handleSave={handleSave}
        />
        <div>
          <button
            onClick={handlePrevPage}
            className={clsx("text-accent underline underline-offset-2 text-sm mr-3", currentPage === 0 && 'text-secondary')}
            disabled={currentPage === 0}
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            className={clsx("text-accent underline underline-offset-2 text-sm", !moreAvailable && 'text-secondary')}
            disabled={!moreAvailable}
          >
            Next
          </button>
        </div>
      </span>
      <Table>
        <TableHeader>
          <TableRow className="flex w-full">
            <TableHead className="flex-grow flex-shrink w-1/5">Name</TableHead>
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
            <TableRow key={item.supply_id} className="flex w-full">
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
    </section>
  )
}
