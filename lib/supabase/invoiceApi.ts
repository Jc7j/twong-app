import { supabase } from '@/lib/supabase/server'
import { Invoice } from '@/lib/definitions'

export const createInvoiceForProperty = async (
  propertyId: number
): Promise<Invoice> => {
  const { data, error } = await supabase.from('invoices').insert([
    {
      property_id: propertyId,
      invoice_month: new Date().toISOString().slice(0, 10),
      last_modified: new Date(),
      management_fee: 0,
      total: 0,
    },
  ])

  if (error) {
    console.error('Error creating invoice:', error.message)
    throw new Error(error.message)
  }
  console.log(data)
  if (!data) {
    throw new Error('Failed to create invoice. No data was returned.')
  }

  return data[0]
}
