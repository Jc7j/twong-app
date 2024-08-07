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
      invoiceItems:invoice_items(*)
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

export async function updateInvoiceTotal(
  invoiceId: number,
  total: number
) {
  const { error } = await supabase
    .from('invoices')
    .update({ total })
    .match({ invoice_id: invoiceId })
  if (error) throw new Error('Failed to update invoice total')
}

export async function fetchInvoices(date: Date) {
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  const invoiceMonth = `${year}-${month}-05`

  const { data, error } = await supabase
    .from('invoices')
    .select(
      `total, management_fee, invoice_month, invoice_items(price_at_creation, quantity, name, is_maintenance),
      properties(name, address)
      `
    )
    .eq('invoice_month', invoiceMonth)
    .order('properties(name)', { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function createNewInvoice(property_id: number): Promise<Invoice> {
  const { data, error } = await supabase
    .from('invoices')
    .insert({ property_id, last_modified: new Date() })
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

export async function updateManagementFee(
  invoiceId: number,
  managementFee: number
) {
  const { error } = await supabase
    .from('invoices')
    .update({ management_fee: managementFee })
    .match({ invoice_id: invoiceId })
  if (error) throw new Error('Failed to update management fee')
}

export async function addInvoiceItem(
  invoiceId: number,
  name: string,
  quantity: number,
  price_at_creation: number,
  is_maintenance: boolean
) {
  const { error } = await supabase
    .from('invoice_items')
    .insert({ invoice_id: invoiceId, quantity, name, price_at_creation, is_maintenance })
  if (error) throw new Error('Failed to add invoice item')
}

export async function updateInvoiceItemQuantity(
  itemId: number,
  newQuantity: number
) {
  const { error } = await supabase
    .from('invoice_items')
    .update({
      quantity: newQuantity,
    })
    .match({ item_id: itemId })

  if (error) {
    console.error('Error updating invoice item quantity:', error.message)
    throw new Error('Failed to update invoice item quantity.')
  }
}

export async function deleteInvoiceItem(itemId: number) {
  const { error } = await supabase
    .from('invoice_items')
    .delete()
    .match({ item_id: itemId })

  if (error) {
    console.error('Error deleting invoice item', error.message)
    throw new Error('Failed to delete invoice item')
  }
}

export async function deleteInvoice(invoiceId: number) {
  const { error: itemsError } = await supabase
    .from('invoice_items')
    .delete()
    .match({ invoice_id: invoiceId })

  if (itemsError) {
    console.error('Error deleting invoice items', itemsError.message)
    throw new Error('Failed to delete invoice items')
  }

  const { error } = await supabase
    .from('invoices')
    .delete()
    .match({ invoice_id: invoiceId })

  if (error) {
    console.error('Error deleting invoice', error.message)
    throw new Error('Failed to delete invoice')
  }
}
