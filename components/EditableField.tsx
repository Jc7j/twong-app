import React, { useState, useEffect, ElementType } from 'react'

interface EditableFieldProps {
  value: any
  onChange: (newValue: string) => void
  isEditing: boolean
  as?: ElementType
  className?: string
}

export function EditableField({
  value,
  onChange,
  isEditing,
  as: Component = 'p',
  className = '',
}: EditableFieldProps) {
  const [editValue, setEditValue] = useState(value)

  useEffect(() => {
    setEditValue(value)
  }, [value])

  function handleBlur() {
    onChange(editValue)
    // Reset editValue to value on blur to discard uncommitted changes
    setEditValue(value)
  }

  return isEditing ? (
    <input
      type="text"
      className={`form-input px-2 py-1 rounded border mt-1 w-full ${className}`}
      value={editValue}
      onChange={(e) => setEditValue(e.target.value)}
      onBlur={handleBlur}
      autoFocus
    />
  ) : (
    <Component className={`${className} mt-1`}>{value}</Component>
  )
}
