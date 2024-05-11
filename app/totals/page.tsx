import PropertyMonthInvoiceTable from '@/components/properties/PropertyMonthInvoiceTable'

export default function Totals() {
  return (
    <section className="bg-bacgrond h-screen container">
      <h1 className="md:mt-16 pr-6 text-4xl font-medium">Totals</h1>
      <div>
        <PropertyMonthInvoiceTable />
      </div>
    </section>
  )
}
