import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { InvoiceDocumentData } from '../modern-invoice-doc';

interface InvoiceCustomerInfoProps {
  invoice: InvoiceDocumentData;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  section: {
    width: '48%'
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.3
  },
  infoBox: {
    backgroundColor: '#f9fafb',
    padding: 8,
    borderRadius: 4,
    borderLeftWidth: 2,
    borderLeftColor: '#3b82f6'
  },
  companyName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 2
  },
  addressLine: {
    fontSize: 8,
    color: '#4b5563',
    marginBottom: 1
  },
  contactLine: {
    fontSize: 8,
    color: '#4b5563',
    marginBottom: 1
  },
  customerName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 2
  },
  billingNote: {
    fontSize: 7,
    color: '#6b7280',
    fontStyle: 'italic',
    marginTop: 4
  }
});

export const InvoiceCustomerInfo: React.FC<InvoiceCustomerInfoProps> = ({ invoice }) => {
  const formatCustomerName = (customer: any) => {
    if (customer.company_name) {
      return customer.company_name;
    }
    return `${customer.first_name} ${customer.last_name}`;
  };

  const getBillToAddress = () => {
    // Use custom billing address if provided, otherwise use customer address
    return {
      street: invoice.bill_to_street_address || invoice.customer.street_address,
      city: invoice.bill_to_city || invoice.customer.city,
      state: invoice.bill_to_state || invoice.customer.state,
      zipcode: invoice.bill_to_zipcode || invoice.customer.zipcode
    };
  };

  const billToAddress = getBillToAddress();

  return (
    <View style={styles.container}>
      {/* Bill From Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>From</Text>
        <View style={styles.infoBox}>
          <Text style={styles.companyName}>RIOS ROOFING</Text>
          <Text style={styles.addressLine}>
            {invoice.bill_from_street_address || '150 Tallant St'}
          </Text>
          <Text style={styles.addressLine}>
            {invoice.bill_from_city || 'Houston'}, {invoice.bill_from_state || 'TX'}{' '}
            {invoice.bill_from_zipcode || '77076'}
          </Text>
          {invoice.bill_from_email && (
            <Text style={styles.contactLine}>Email: {invoice.bill_from_email}</Text>
          )}
          <Text style={styles.contactLine}>Phone: 832-310-3593</Text>
          <Text style={styles.contactLine}>Email: rrios.roofing@gmail.com</Text>
        </View>
      </View>

      {/* Bill To Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bill To</Text>
        <View style={styles.infoBox}>
          <Text style={styles.customerName}>{formatCustomerName(invoice.customer)}</Text>
          <Text style={styles.addressLine}>{billToAddress.street}</Text>
          <Text style={styles.addressLine}>
            {billToAddress.city}, {billToAddress.state} {billToAddress.zipcode}
          </Text>
          <Text style={styles.contactLine}>Phone: {invoice.customer.phone_number}</Text>
          <Text style={styles.contactLine}>Email: {invoice.customer.email}</Text>

          {/* {invoice.bill_to_street_address && (
            <Text style={styles.billingNote}>* Custom billing address</Text>
          )} */}
        </View>
      </View>
    </View>
  );
};
