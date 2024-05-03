import PropertiesView from '@/components/PropertiesView'

export default function Home() {
  return (
    <main className="container bg-background">
      <div className="md:mt-16">
        <span className="flex items-center">
          <h1 className="pr-6 text-2xl">Properties</h1>
          <p>download invoices</p>
        </span>
      </div>

      <span className="flex mt-9">
        <p>search bar</p>
        <p>Create New Property</p>
      </span>

      <div className="flex mt-9">
        <PropertiesView />

        <div>Invoice view</div>
      </div>
    </main>
  )
}
