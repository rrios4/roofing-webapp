import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { QuoteDocumentData } from '../modern-quote-doc';

interface QuoteCustomerInfoProps {
  quote: QuoteDocumentData;
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
  serviceNote: {
    fontSize: 7,
    color: '#6b7280',
    fontStyle: 'italic',
    marginTop: 4
  }
});

export const QuoteCustomerInfo: React.FC<QuoteCustomerInfoProps> = ({ quote }) => {
  const formatCustomerName = (customer: any) => {
    if (customer.company_name) {
      return customer.company_name;
    }
    return `${customer.first_name} ${customer.last_name}`;
  };

  const getQuoteToAddress = () => {
    // Prioritize custom address fields, fall back to customer address
    return {
      street: quote.custom_street_address || quote.customer.street_address,
      city: quote.custom_city || quote.customer.city,
      state: quote.custom_state || quote.customer.state,
      zipcode: quote.custom_zipcode || quote.customer.zipcode
    };
  };

  const quoteToAddress = getQuoteToAddress();

  return (
    <View style={styles.container}>
      {/* Quote From Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quote From</Text>
        <View style={styles.infoBox}>
          <Text style={styles.companyName}>RIOS ROOFING</Text>
          <Text style={styles.addressLine}>150 Tallant St</Text>
          <Text style={styles.addressLine}>Houston, TX 77076</Text>
          <Text style={styles.contactLine}>Phone: 832-310-3593</Text>
          <Text style={styles.contactLine}>Email: rrios.roofing@gmail.com</Text>
        </View>
      </View>

      {/* Quote To Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quote To</Text>
        <View style={styles.infoBox}>
          <Text style={styles.customerName}>{formatCustomerName(quote.customer)}</Text>
          <Text style={styles.addressLine}>{quoteToAddress.street}</Text>
          <Text style={styles.addressLine}>
            {quoteToAddress.city}, {quoteToAddress.state} {quoteToAddress.zipcode}
          </Text>
          <Text style={styles.contactLine}>Phone: {quote.customer.phone_number}</Text>
          <Text style={styles.contactLine}>Email: {quote.customer.email}</Text>

          {quote.service && <Text style={styles.serviceNote}>Service: {quote.service.name}</Text>}

          {(quote.custom_street_address ||
            quote.custom_city ||
            quote.custom_state ||
            quote.custom_zipcode) && (
            <Text style={styles.serviceNote}>* Custom service address</Text>
          )}
        </View>
      </View>
    </View>
  );
};
