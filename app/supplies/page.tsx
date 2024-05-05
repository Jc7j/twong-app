import CreateNewCta from '@/components/CreateNewCta'
import SuppliesView from '@/components/supplies/SuppliesView'

export default function Supplies() {
  return (
    <main className="container bg-background h-screen">
      <div className="flex md:mt-16">
        <h1 className="pr-6 text-4xl font-medium">Supplies</h1>
      </div>

      <span className="md:mt-8 items-center">
        <CreateNewCta whichOne="supplyItem" />
      </span>

      <SuppliesView />
    </main>
  )
}
