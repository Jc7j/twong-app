export default function Home() {
  return (
    <main className="container">
      <div className="md:mt-16">
        <span className="flex items-center">
        <h1 className="pr-6 text-2xl">Properties</h1>
        <p>download invoices</p>
        </span>
        <span className="flex">
          <p>search bar</p>
          <p>Create New Property</p>
        </span>
      </div>

      <div className="flex">
      <div>
        properties view
      </div>

      <div>Invoice view</div>
      </div>
    </main>
  )
}
