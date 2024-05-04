'use client'

import { supabase } from '@/lib/supabase/server'

export default function CreateNewCta({
  whichOne,
}: {
  whichOne: 'property' | 'invoice'
}) {
  async function createNewPropertyOnClick() {
    const { data, error } = await supabase.from('properties').insert([{}])

    if (error) {
      console.error('Error inserting property with default values:', error)
      return
    }

    console.log('Inserted property with default values:', data)
    return data
  }

  if (whichOne === 'property') {
    return (
      <button
        className="px-5 py-3 text-sm shadow border bg-accent text-background rounded-lg"
        onClick={createNewPropertyOnClick}
      >
        Create New Property
      </button>
    )
  }
}
