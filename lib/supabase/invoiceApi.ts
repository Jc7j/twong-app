import { supabase } from '@/lib/supabase/server'
import { Invoice } from '@/lib/definitions'

export async function fetchInvoicesByPropertyId(
  propertyId: number
): Promise<Invoice[]> {
  const { data: invoices, error } = await supabase
    .from('invoices')
    .select(
      `
      invoice_id,
      property_id,
      invoice_month,
      total,
      last_modified,
      management_fee,
      invoiceItems:invoice_items(*, supplyItem:supply_items(*))
    `
    )
    .eq('property_id', propertyId)
    .order('invoice_month', { ascending: false })

  if (error) {
    console.error('Error fetching invoices for property:', error.message)
    throw new Error(error.message)
  }

  return invoices
}

export async function createNewInvoice(property_id: number): Promise<Invoice> {
  const { data, error } = await supabase
    .from('invoices')
    .insert([{ property_id }])
    .select()
  if (error) {
    console.error('Error inserting new invoice:', error)
    throw new Error(error.message)
  }
  return data[0] as Invoice
}

export async function updateInvoiceMonth(
  invoiceId: number,
  invoiceMonth: string
): Promise<Invoice['invoice_month']> {
  const { data, error } = await supabase
    .from('invoices')
    .update({
      invoice_month: new Date(invoiceMonth).toISOString(),
      last_modified: new Date(),
    })
    .match({ invoice_id: invoiceId })
    .select()

  if (error) {
    console.error('Error updating invoice:', error.message)
    throw new Error(error.message)
  }

  return data[0].invoice_month
}
