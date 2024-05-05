import { supabase } from '@/lib/supabase/server'
import { Invoice } from '@/lib/definitions'

export async function fetchInvoicesByPropertyId(propertyId: number): Promise<Invoice[]> {
  const { data: invoices, error } = await supabase
    .from('invoices')
    .select(`
      invoice_id,
      property_id,
      invoice_month,
      total,
      last_modified,
      management_fee,
      invoiceItems:invoice_items(*, supplyItem:supply_items(*))
    `)
    .eq('property_id', propertyId)
    .order('invoice_month', { ascending: false });

  if (error) {
    console.error('Error fetching invoices for property:', error.message);
    throw new Error(error.message);
  }

  return invoices;
}

export async function createInvoiceForProperty (propertyId: number) {
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
}

export async function updateInvoiceMonth (
  invoiceId: number,
  invoiceMonth: string
) {
  const { data, error } = await supabase
    .from('invoices')
    .update({
      invoice_month: new Date(invoiceMonth).toISOString(),
      last_modified: new Date(),
    })
    .match({ invoice_id: invoiceId })

  if (error) {
    console.error('Error updating invoice:', error.message)
    throw new Error(error.message)
  }
}
