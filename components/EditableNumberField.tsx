import React, { useState, useEffect, ElementType } from 'react'

interface EditableNumberFieldProps {
  as?: ElementType
  autoFocus?: boolean
  className?: string
  isEditing: boolean
  onChange: (newValue: number) => void
  value: number
  step?: number
  min?: number
  max?: number
}

export function EditableNumberField({
  as: Component = 'p',
  autoFocus,
  className = '',
  isEditing,
  onChange,
  value,
  step = 1,
  min,
  max,
}: EditableNumberFieldProps) {
  const [editValue, setEditValue] = useState(value.toString())

  useEffect(() => {
    setEditValue(value.toString())
  }, [value])

  function handleBlur() {
    // Convert the input string back to a number when emitting changes outside
    const numValue = parseFloat(editValue)
    onChange(isNaN(numValue) ? 0 : numValue)
    // Reset editValue to the original value on blur to discard uncommitted changes
    setEditValue(value.toString())
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    // Update local state to reflect the input element's current value
    setEditValue(e.target.value)
  }

  return isEditing ? (
    <input
      type="number"
      className={`form-input px-2 py-1 rounded border mt-1 w-full ${className}`}
      value={editValue}
      onChange={handleChange}
      onBlur={handleBlur}
      autoFocus={autoFocus}
      step={step}
      min={min}
      max={max}
    />
  ) : (
    <Component className={`${className} mt-1`}>{value}</Component>
  )
}
