import SuppliesView from '@/components/supplies/SuppliesView'

export default function Supplies() {
  return (
    <main className="container bg-background h-screen">
      <div className="md:mt-16">
        <h1 className="pr-6 text-4xl font-medium">Supplies</h1>
      </div>

      <SuppliesView />
    </main>
  )
}
