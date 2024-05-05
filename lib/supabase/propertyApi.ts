import { supabase } from '@/lib/supabase/server'
import { Property } from '@/lib/definitions'

export async function fetchProperties(): Promise<Property[]> {
  const { data: properties, error } = await supabase
    .from('properties')
    .select(
      `
      *,
      owner:owners(*),
      invoices:invoices(*, invoiceItems:invoice_items(*, supplyItem:supply_items(*)))
    `
    )
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching properties:', error)
    throw new Error(error.message)
  }

  return properties
}

export async function updatePropertyDetails(
  propertyId: number,
  updates: Partial<Property>
): Promise<void> {
  const { data, error } = await supabase
    .from('properties')
    .update(updates)
    .match({ property_id: propertyId })

  if (error) {
    console.error('Error updating property:', error.message)
    throw new Error(error.message)
  }

  console.log('Updated property data:', data)
}

export async function createNewProperty() {
  const { data, error } = await supabase.from('properties').insert([{}])

  if (error) {
    console.error('Error inserting property with default values:', error)
    return
  }

  return data
}