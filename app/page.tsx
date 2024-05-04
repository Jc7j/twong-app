'use client'

import { useEffect } from 'react'

import CreateNewCta from '@/components/CreateNewCta'
import InvoiceView from '@/components/properties/InvoiceView'
import PropertiesView from '@/components/properties/PropertiesView'
import { useStore } from '@/hooks/stores/useStore'

export default function Home() {
  const { properties, fetchProperties, selectedPropertyId } = useStore()

  useEffect(() => {
    if (properties.length === 0) {
      fetchProperties()
    }
  }, [properties.length, fetchProperties])

  return (
    <main className="container bg-background h-screen">
      <div className="md:mt-16 flex-grow-0">
        <span className="flex items-end">
          <h1 className="pr-6 text-4xl font-medium">Properties</h1>
          <p>download invoices</p>
        </span>
      </div>

      <span className="flex mt-9 items-center justify-between md:justify-normal">
        <p className="md:w-1/3">search bar</p>
        <CreateNewCta whichOne="property" />
      </span>

      <div className="flex flex-grow mt-9 flex-col-reverse md:flex-row">
        <PropertiesView
          properties={properties}
          selectedPropertyId={selectedPropertyId}
        />

        <InvoiceView
          properties={properties}
          selectedPropertyId={selectedPropertyId}
        />
      </div>
    </main>
  )
}
