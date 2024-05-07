import { supabase } from '@/lib/supabase/server'
import {  Property } from '@/lib/definitions'

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

export async function fetchPropertyById(propertyId: number): Promise<Property> {
  const { data, error } = await supabase
    .from('properties')
    .select(
      `
      *,
      owner:owners(*),
      invoices:invoices(*, invoiceItems:invoice_items(*, supplyItem:supply_items(*)))
    `
    )
    .eq('property_id', propertyId)
    .single()

  if (error) {
    console.error('Error fetching property by ID:', error)
    throw new Error(error.message)
  }

  return data
}

export async function updatePropertyDetails(
  propertyId: number,
  updates: Partial<Property>
) {
  const { data, error } = await supabase
    .from('properties')
    .update(updates)
    .match({ property_id: propertyId })

  if (error) {
    console.error('Error updating property:', error.message)
    throw new Error(error.message)
  }

  if (data) {
    return data
  }
}

export async function createNewProperty({
  name,
  address,
}: {
  name: string
  address: string
}) {
  const { data, error } = await supabase.from('properties').insert({
    name: name,
    address: address,
  })

  if (error) {
    console.error('Error inserting new property:', error)
    throw new Error('Failed to create new property')
  }

  return data
}
