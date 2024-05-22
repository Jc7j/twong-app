import InvoicesView from '@/components/properties/InvoicesView'
import PropertiesView from '@/components/properties/PropertiesView'

export default function Home() {
  return (
    <main className="container bg-background h-screen flex-grow md:overflow-auto">
      <h1 className="md:mt-16 flex-grow-0 pr-6 text-4xl font-medium">
        Properties
      </h1>

      <div className="flex flex-grow mt-9 flex-col-reverse md:flex-row">
        <PropertiesView />

        <InvoicesView />
      </div>
    </main>
  )
}
