import React from 'react';
import { Page, Document, StyleSheet, Text, View, Image } from '@react-pdf/renderer';
import { formatDate, formatNumber, formatMoneyValue } from '../../lib/utils';

// Simplified Quote Document Data interface
export interface QuoteDocumentData {
  quote_number?: number;
  quote_date?: string;
  expiration_date?: string;
  total?: number;
  subtotal?: number;
  service?: {
    name?: string;
  };
  customer?: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone_number?: string;
    street_address?: string;
    city?: string;
    state?: string;
    zipcode?: string;
  };
  quote_status?: {
    name?: string;
  };
  custom_address?: boolean;
  custom_street_address?: string;
  custom_city?: string;
  custom_state?: string;
  custom_zipcode?: string;
  public_note?: string;
  cust_note?: string;
  measurement_note?: string;
  quote_line_item?: Array<{
    id?: number;
    description?: string;
    qty?: number;
    rate?: number;
    amount?: number;
    fixed_item?: boolean;
    sq_ft?: number;
  }>;
  converted?: boolean;
}

export interface PDFDisplayOptions {
  showServiceDetails: boolean;
  showMeasurementNote: boolean;
  showCustomerNotes: boolean;
}

interface QuoteDocumentProps {
  quote: QuoteDocumentData;
  displayOptions?: PDFDisplayOptions;
}

const styles = StyleSheet.create({
  page: {
    fontSize: 9,
    paddingTop: 25,
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 25,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
    lineHeight: 1.3
  },
  // Header styles
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  logoSection: {
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  logo: {
    width: 40,
    height: 40,
    marginBottom: 6,
    borderRadius: 6
  },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 2
  },
  companyTagline: {
    fontSize: 8,
    color: '#6b7280',
    fontStyle: 'italic'
  },
  quoteSection: {
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  quoteTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 14,
    letterSpacing: 0.5
  },
  // Customer info styles
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
  // Items table styles
  table: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 4,
    marginBottom: 15
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingVertical: 6,
    paddingHorizontal: 8
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingVertical: 6,
    paddingHorizontal: 8
  },
  // Summary styles
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 15
  },
  summaryBox: {
    width: '45%',
    backgroundColor: '#f9fafb',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6'
  },
  totalRow: {
    backgroundColor: '#dbeafe',
    borderBottomWidth: 0,
    borderTopWidth: 2,
    borderTopColor: '#3b82f6'
  },
  // Text styles
  text: {
    fontSize: 8,
    color: '#1f2937'
  },
  labelText: {
    fontSize: 8,
    color: '#374151'
  },
  totalText: {
    fontSize: 9,
    color: '#1e40af',
    fontWeight: 'bold'
  }
});

export const ModernQuoteDocument: React.FC<QuoteDocumentProps> = ({
  quote,
  displayOptions = {
    showServiceDetails: true,
    showMeasurementNote: true,
    showCustomerNotes: true
  }
}) => {
  const formatMoney = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getQuoteToAddress = () => {
    if (quote.custom_address && quote.custom_street_address) {
      return {
        street: quote.custom_street_address,
        city: quote.custom_city,
        state: quote.custom_state,
        zipcode: quote.custom_zipcode
      };
    }

    return {
      street: quote.customer?.street_address,
      city: quote.customer?.city,
      state: quote.customer?.state,
      zipcode: quote.customer?.zipcode
    };
  };

  const quoteToAddress = getQuoteToAddress();
  const hasLineItems = quote.quote_line_item && quote.quote_line_item.length > 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.logoSection}>
            <Image style={styles.logo} src="/public/company-logo.png" />
            <Text style={styles.companyName}>RIOS ROOFING</Text>
            <Text style={styles.companyTagline}>Professional Roofing Services</Text>
          </View>

          <View style={styles.quoteSection}>
            <Text style={styles.quoteTitle}>QUOTE</Text>
            <Text style={styles.text}>Quote #: QT-{formatNumber(quote.quote_number || 0)}</Text>
            <Text style={styles.text}>Date: {formatDate(quote.quote_date)}</Text>
            <Text style={styles.text}>Expires: {formatDate(quote.expiration_date)}</Text>
            {quote.service && (
              <Text style={[styles.text, { marginTop: 4, fontWeight: 'bold', color: '#0c4a6e' }]}>
                Service: {quote.service.name}
              </Text>
            )}
          </View>
        </View>

        {/* Customer Information */}
        <View style={styles.container}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quote From</Text>
            <View style={styles.infoBox}>
              <Text style={styles.text}>RIOS ROOFING</Text>
              <Text style={styles.text}>150 Tallant St</Text>
              <Text style={styles.text}>Houston, TX 77076</Text>
              <Text style={styles.text}>Phone: 832-310-3593</Text>
              <Text style={styles.text}>Email: rrios.roofing@gmail.com</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quote To</Text>
            <View style={styles.infoBox}>
              <Text style={styles.text}>
                {quote.customer?.first_name} {quote.customer?.last_name}
              </Text>
              <Text style={styles.text}>{quoteToAddress.street}</Text>
              <Text style={styles.text}>
                {quoteToAddress.city}, {quoteToAddress.state} {quoteToAddress.zipcode}
              </Text>
              <Text style={styles.text}>Phone: {quote.customer?.phone_number}</Text>
              <Text style={styles.text}>Email: {quote.customer?.email}</Text>
            </View>
          </View>
        </View>

        {/* Items Table */}
        <View>
          <Text style={styles.sectionTitle}>Quote Items</Text>
          <View style={styles.table}>
            {/* Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.labelText, { flex: 3 }]}>Description</Text>
              <Text style={[styles.labelText, { flex: 1, textAlign: 'center' }]}>Qty</Text>
              <Text style={[styles.labelText, { flex: 1.2, textAlign: 'right' }]}>Rate</Text>
              <Text style={[styles.labelText, { flex: 1.2, textAlign: 'right' }]}>Amount</Text>
            </View>

            {/* Items */}
            {hasLineItems ? (
              quote.quote_line_item!.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.text, { flex: 3 }]}>{item.description}</Text>
                  <Text style={[styles.text, { flex: 1, textAlign: 'center' }]}>{item.qty}</Text>
                  <Text style={[styles.text, { flex: 1.2, textAlign: 'right' }]}>
                    {item.fixed_item ? 'Fixed' : formatMoney(item.rate)}
                  </Text>
                  <Text style={[styles.text, { flex: 1.2, textAlign: 'right' }]}>
                    {formatMoney(item.amount)}
                  </Text>
                </View>
              ))
            ) : (
              <View style={styles.tableRow}>
                <Text style={[styles.text, { flex: 3 }]}>
                  {quote.service?.name || 'Roofing Service'}
                </Text>
                <Text style={[styles.text, { flex: 1, textAlign: 'center' }]}>1</Text>
                <Text style={[styles.text, { flex: 1.2, textAlign: 'right' }]}>Fixed</Text>
                <Text style={[styles.text, { flex: 1.2, textAlign: 'right' }]}>
                  {formatMoney(quote.total)}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.labelText}>Subtotal:</Text>
              <Text style={styles.text}>{formatMoney(quote.subtotal)}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalText}>Quote Total:</Text>
              <Text style={styles.totalText}>{formatMoney(quote.total)}</Text>
            </View>
          </View>
        </View>

        {/* Customer Notes */}
        {displayOptions.showCustomerNotes && (quote.public_note || quote.cust_note) && (
          <View style={{ marginBottom: 15 }}>
            <Text style={styles.sectionTitle}>Customer Notes</Text>
            <View style={styles.infoBox}>
              {quote.public_note && (
                <View style={{ marginBottom: 4 }}>
                  <Text style={styles.text}>{quote.public_note}</Text>
                </View>
              )}
              {quote.cust_note && (
                <View style={{ marginBottom: 4 }}>
                  <Text style={styles.text}>{quote.cust_note}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Measurement Notes */}
        {displayOptions.showMeasurementNote && quote.measurement_note && (
          <View style={{ marginBottom: 15 }}>
            <Text style={styles.sectionTitle}>Measurement Notes</Text>
            <View style={styles.infoBox}>
              <Text style={styles.text}>{quote.measurement_note}</Text>
            </View>
          </View>
        )}

        {/* Service Details */}
        {displayOptions.showServiceDetails && quote.service?.name === 'Roof Installation' && (
          <View style={{ marginBottom: 15 }}>
            <Text style={styles.sectionTitle}>Service Details</Text>
            <View style={styles.infoBox}>
              {/* <Text style={[styles.text, { fontWeight: 'bold', marginBottom: 6, color: '#374151' }]}>
                Service Includes:
              </Text> */}
              <Text
                style={[styles.text, { fontWeight: 'bold', marginBottom: 4, color: '#374151' }]}>
                Roof Installation includes:
              </Text>
              <View style={{ marginBottom: 8 }}>
                <Text style={styles.text}>• 30 year rated roofing shingles</Text>
                <Text style={styles.text}>• Synthetic Roofing Underlayment</Text>
                <Text style={styles.text}>• Ridge vents & ridge caps</Text>
                <Text style={styles.text}>• New 2x2 dripedge installation</Text>
                <Text style={styles.text}>• All New base lead jacks.</Text>
                <Text style={styles.text}>• New valley (if applicable)</Text>
                <Text style={styles.text}>
                  • Up to 3 sheets of new plywood ($85 per extra sheet)
                </Text>
                <Text style={styles.text}>
                  • Labor to install new shingles (6 nail for secure hold against storms)
                </Text>
                <Text style={styles.text}>• Cleaning Debris</Text>
              </View>
              <Text
                style={[styles.text, { fontStyle: 'italic', color: '#374151', lineHeight: 1.4 }]}>
                In order to initiate the roofing process promptly, we kindly request a down payment
                of 50% of the total quoted amount, which will be allocated towards the procurement
                of necessary materials.
              </Text>
            </View>
          </View>
        )}

        {/* Footer */}
        <View
          style={{
            marginTop: 'auto',
            borderTopWidth: 1,
            borderTopColor: '#e5e7eb',
            paddingTop: 10
          }}>
          <Text style={[styles.text, { textAlign: 'center', color: '#3b82f6' }]}>
            Thank you for considering us! To accept this quote, please contact us at 832-310-3593.
          </Text>
          <Text style={[styles.text, { textAlign: 'center', marginTop: 5 }]}>
            RIOS ROOFING • 150 Tallant St, Houston TX 77076 • rrios.roofing@gmail.com
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default ModernQuoteDocument;
