import { supabase } from '@/lib/supabase/server'
import { Owner } from '@/lib/definitions'

export async function fetchOwnerByPropertyId(propertyId: number): Promise<Owner[]> {
  const { data: owners, error } = await supabase
    .from('owners')
    .select('*')
    .eq('property_id', propertyId);

  if (error) {
    console.error('Error fetching owner for property:', error.message);
    throw new Error(error.message);
  }

  return owners;
}


export const updateOwnerDetails = async (
  ownerId: number,
  ownerUpdates: Partial<Owner>
) => {
  const { data, error } = await supabase
    .from('owners')
    .update(ownerUpdates)
    .match({ owner_id: ownerId })

  if (error) {
    console.error('Error updating owner:', error.message)
    throw new Error(error.message)
  }

  return data
}
