export interface Owner {
  readonly ownerId: number
  readonly name: string
  readonly email: string
  phoneNumber: string
}

export interface Property {
  readonly propertyId: number
  readonly ownerId: number
  name: string
  address: string
  owner?: Owner
  invoices?: Invoice[]
}

export interface SupplyItem {
  readonly supplyId: number
  name: string
  price: number
  qtyPerPackage: number
  link?: string
  multiplier: number
}

export interface Invoice {
  readonly invoiceId: number
  readonly propertyId: number
  invoiceMonth: Date
  lastModified: Date
  managementFee: number
  total: number
  invoiceItems?: InvoiceItem[]
}

export interface InvoiceItem {
  readonly itemId: number
  readonly invoiceId: number
  readonly supplyId: number
  quantity: number
  supplyItem?: SupplyItem
}

export interface AppState {
  properties: Property[]
  setProperties: (properties: Property[]) => void
  fetchProperties: () => Promise<void>
}
