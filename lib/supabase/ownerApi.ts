import { supabase } from '@/lib/supabase/server'
import { Owner } from '@/lib/definitions'

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
