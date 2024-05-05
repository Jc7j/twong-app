import { z } from 'zod'

export const monthYearSchema = z.string().refine(
  (value) => {
    const parts = value.split(' ')
    if (parts.length !== 2) return false

    const [month, year] = parts
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
    const monthIndex = months.indexOf(month)
    const yearValid =
      /^\d{4}$/.test(year) && parseInt(year) > 1900 && parseInt(year) < 3000

    return monthIndex !== -1 && yearValid
  },
  {
    message: "Invalid date format. Please enter date as 'Month YYYY'.",
  }
)
