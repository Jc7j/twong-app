import React from 'react'

interface EditModeToggleProps {
  isEditing: boolean
  setIsEditing: (isEditing: boolean) => void
  handleSave: () => void
  editText?: string
}

export function EditModeToggle({
  isEditing,
  setIsEditing,
  handleSave,
  editText,
}: EditModeToggleProps) {
  return isEditing ? (
    <button
      onClick={handleSave}
      className="px-3 py-1 bg-accent text-background rounded-lg text-sm"
    >
      Save changes
    </button>
  ) : (
    <button
      onClick={() => setIsEditing(true)}
      className="text-accent underline underline-offset-2 text-sm focus:outline-none"
    >
      {editText ? editText : 'Edit'}
    </button>
  )
}
