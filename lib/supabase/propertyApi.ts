import { supabase } from '@/lib/supabase/server';
import { Property } from '@/lib/definitions';

export const fetchProperties = async (): Promise<Property[]> => {
  const { data: properties, error } = await supabase.from('properties')
    .select(`
      *,
      owner:owners(*),
      invoices:invoices(*, invoiceItems:invoice_items(*, supplyItem:supply_items(*)))
    `);

  if (error) {
    console.error('Error fetching properties:', error);
    throw new Error(error.message);
  }

  return properties.sort((a, b) => a.name.localeCompare(b.name));
};

export const updatePropertyDetails = async (
  propertyId: number,
  updates: Partial<Property>
): Promise<void> => {
  const { data, error } = await supabase
    .from('properties')
    .update(updates)
    .match({ property_id: propertyId });

  if (error) {
    console.error('Error updating property:', error.message);
    throw new Error(error.message);
  }

  console.log('Updated property data:', data);
};
