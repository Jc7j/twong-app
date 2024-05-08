import { supabase } from '@/lib/supabase/server'
import { SupplyItem } from '@/lib/definitions'

export async function fetchPaginatedSupplyItems(page: number, limit: number) {
  const startIndex = page * limit
  const endIndex = startIndex + limit - 1

  const { data, error } = await supabase
    .from('supply_items')
    .select('*')
    .order('name', { ascending: true })
    .range(startIndex, endIndex)

  if (error) {
    throw new Error('Error fetching supply items: ' + error.message)
  }

  return data
}

export async function fetchAllSupplyItems(): Promise<SupplyItem[]> {
  const { data, error } = await supabase
    .from('supply_items')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    throw new Error('Error fetching supply items: ' + error.message)
  }
  return data
}

export async function addSupplyItem(
  name: string,
  price: number,
  qty: number,
  link: string
) {
  const { data, error } = await supabase
    .from('supply_items')
    .insert({ name, price, qty_per_package: qty, link: link })
  if (error) throw new Error('Error adding supply item: ' + error.message)
  return data
}

export async function updateSupplyItem(
  supply_id: number,
  updates: Partial<SupplyItem>
) {
  const { data, error } = await supabase
    .from('supply_items')
    .update(updates)
    .match({ supply_id })

  if (error) throw new Error('Error updating supply item: ' + error.message)
  return data
}

export async function deleteSupplyItem(supply_id: number) {
  const { error } = await supabase
    .from('supply_items')
    .delete()
    .match({ supply_id })
  if (error) throw new Error('Error deleting supply item: ' + error.message)
}
