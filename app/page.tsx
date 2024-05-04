import InvoiceView from '@/components/InvoiceView'
import PropertiesView from '@/components/PropertiesView'

export default function Home() {
  return (
    <main className="container bg-background h-screen">
      <div className="md:mt-16 flex-grow-0">
        <span className="flex items-end">
          <h1 className="pr-6 text-4xl font-medium">Properties</h1>
          <p>download invoices</p>
        </span>
      </div>

      <span className="flex mt-9">
        <p>search bar</p>
        <p>Create New Property</p>
      </span>

      <div className="flex flex-grow gap-8 mt-9 flex-col md:flex-row">
        <PropertiesView />

        <InvoiceView />
      </div>
    </main>
  )
}

