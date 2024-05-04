export interface Owner {
  readonly owner_id: number
  readonly name: string
  readonly email: string
  phone_number: string
}

export interface Property {
  readonly property_id: number
  readonly owner_id: number
  name: string
  address: string
  owner?: Owner
  invoices?: Invoice[]
}

export interface SupplyItem {
  readonly supply_id: number
  name: string
  price: number
  qty_per_package: number
  link?: string
  multiplier: number
}

export interface Invoice {
  readonly invoice_id: number
  readonly property_id: number
  invoice_month: Date
  last_modified: Date
  management_fee: number
  total: number
  invoice_items?: InvoiceItem[]
}

export interface InvoiceItem {
  readonly item_id: number
  readonly invoice_id: number
  readonly supply_id: number
  quantity: number
  supply_item?: SupplyItem
}

export interface AppState {
  properties: Property[]
  setProperties: (properties: Property[]) => void
  fetchProperties: () => Promise<void>
}
