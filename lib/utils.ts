import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateWithDay(dateString: Date): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatDate(dateString: Date): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  })
}

export function formatDateWithTime(dateInput: Date): string {
  const date = new Date(dateInput)

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }

  const formattedDate = date.toLocaleDateString('en-US', dateOptions)
  const formattedTime = date
    .toLocaleTimeString('en-US', timeOptions)
    .toLowerCase()

  return `${formattedDate} ${formattedTime} pst`
}

export function formatDateToISO(monthYear: string): string {
  const [month, year] = monthYear.split(' ')
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  const monthIndex = months.indexOf(month) + 1 // Get month as a number
  return `${year}-${monthIndex.toString().padStart(2, '0')}-05` // Formats as "YYYY-MM-01"
}

export function numToFixedFloat(num: number): number {
  const res = parseFloat(num.toString())
  return parseFloat(res.toFixed(2))
}
