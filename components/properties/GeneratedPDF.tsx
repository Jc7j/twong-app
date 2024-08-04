'use client'

import { calculateTax, formatCurrency } from '@/lib/utils'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

function todaysDate() {
  const today = new Date()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  const year = today.getFullYear()
  return `${month}/${day}/${year}`
}

interface InvoiceDetail {
  total: number
  management_fee: number
  invoice_month: string
  invoice_items: {
    quantity: number
    name: string
    price_at_creation: number
    is_maintenance: boolean
  }[]
  properties: {
    name: string
    address: string
  }
}

const styles = StyleSheet.create({
  page: {
    padding: 20,
  },
  billTo: {
    marginBottom: 10,
    fontSize: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginBottom: 10,
  },
  headerLeft: {
    fontSize: 12,
  },
  headerRight: {
    fontSize: 12,
    textAlign: 'right',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  address: {
    fontSize: 10,
    textAlign: 'center',
    // margin: 5,
  },
  table: {
    width: '100%',
    marginTop: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#000',
    backgroundColor: '#f2f2f2',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    padding: 5,
    fontSize: 10,
  },
  tableCellHeader: {
    padding: 5,
    fontSize: 10,
    fontWeight: 'bold',
  },
  supplyTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    fontSize: 10,
  },
  taxText: {
    fontSize: 10,
  },
  total: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#000',
  },
})

export function GeneratedPDF({ invoices }: { invoices: any }) {
  return (
    <Document>
      {invoices.map((invoiceDetails: InvoiceDetail) => {
        const taxableItemsTotal = invoiceDetails.invoice_items
        .filter(item => !item.is_maintenance)
        .reduce((total, item) => total + item.price_at_creation * item.quantity, 0);

        const taxAmount = calculateTax(taxableItemsTotal);

        return (
          <Page
            size="A4"
            style={styles.page}
            key={invoiceDetails.properties.name}
          >
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Text>Only Vegas Realty & Property Management</Text>
                <Text>871 Coronado Center Dr #200</Text>
                <Text>Henderson NV 89052</Text>
                <Text>tiann@onlyvegas.homes</Text>
                <Text>702-981-8828</Text>
              </View>
              <View style={styles.headerRight}>
                <Text>Date: {todaysDate()}</Text>
              </View>
            </View>
            <Text style={styles.title}>
              Invoice for {invoiceDetails.properties.name}
            </Text>
            <Text style={styles.address}>
              {invoiceDetails.properties.address}
            </Text>
            <View style={styles.billTo}>
              <Text>BILL TO:</Text>
              <Text>Fernway</Text>
            </View>
            <Text>Charges and Reimbursements</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableCellHeader, { width: '60%' }]}>
                  Description
                </Text>
                <Text style={[styles.tableCellHeader, { width: '20%' }]}>
                  Quantity
                </Text>
                <Text style={[styles.tableCellHeader, { width: '20%' }]}>
                  Amount
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: '60%' }]}>
                  Property Management Fee
                </Text>
                <Text style={[styles.tableCell, { width: '20%' }]}>{''}</Text>
                <Text style={[styles.tableCell, { width: '20%' }]}>
                  {formatCurrency(invoiceDetails.management_fee)}
                </Text>
              </View>
              {invoiceDetails.invoice_items.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { width: '60%' }]}>
                    {item.name}
                  </Text>
                  <Text style={[styles.tableCell, { width: '20%' }]}>
                    {item.quantity}
                  </Text>
                  <Text style={[styles.tableCell, { width: '20%' }]}>
                    {formatCurrency(item.price_at_creation * item.quantity)}
                  </Text>
                </View>
              ))}
            </View>
            <View style={styles.supplyTotal}>
              <Text>Supplies Total: </Text>
              <Text>
                $
                {(invoiceDetails.total - invoiceDetails.management_fee).toFixed(
                  2
                )}
              </Text>
            </View>
            <View style={styles.total}>
              <Text style={styles.taxText}>Taxes (8.375%): </Text>
              <Text style={styles.taxText}>
                ${taxAmount.toFixed(2)}
              </Text>
            </View>
            <View style={styles.total}>
              <Text>Total Due:</Text>
              <Text>${(invoiceDetails.total + taxAmount).toFixed(2)}</Text>
            </View>
          </Page>
        );
      })}
    </Document>
  )
}

