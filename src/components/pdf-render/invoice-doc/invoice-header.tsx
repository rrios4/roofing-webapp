import React from 'react';
import { Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { formatDate } from '../../../lib/utils';
import { InvoiceDocumentData } from '../modern-invoice-doc';

interface InvoiceHeaderProps {
  invoice: InvoiceDocumentData;
}

const styles = StyleSheet.create({
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
  invoiceSection: {
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  invoiceTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 14,
    letterSpacing: 0.5
  },
  invoiceDetails: {
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 2,
    alignItems: 'center'
  },
  detailLabel: {
    fontSize: 8,
    color: '#6b7280',
    marginRight: 6,
    width: 50,
    textAlign: 'right'
  },
  detailValue: {
    fontSize: 8,
    color: '#1f2937',
    fontWeight: 'medium',
    width: 70
  },
  statusBadge: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: '#fbbf24',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statusBadgePaid: {
    backgroundColor: '#10b981'
  },
  statusBadgeOverdue: {
    backgroundColor: '#ef4444'
  },
  statusText: {
    fontSize: 7,
    color: '#ffffff',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.3
  }
});

export const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({ invoice }) => {
  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return [styles.statusBadge, styles.statusBadgePaid];
      case 'overdue':
        return [styles.statusBadge, styles.statusBadgeOverdue];
      default:
        return styles.statusBadge;
    }
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.logoSection}>
        <Image style={styles.logo} src="/public/company-logo.png" />
        <Text style={styles.companyName}>RIOS ROOFING</Text>
        <Text style={styles.companyTagline}>Professional Roofing Services</Text>
      </View>

      <View style={styles.invoiceSection}>
        <Text style={styles.invoiceTitle}>INVOICE</Text>

        <View style={styles.invoiceDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Invoice #:</Text>
            <Text style={styles.detailValue}>{invoice.invoice_number}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date:</Text>
            <Text style={styles.detailValue}>{formatDate(invoice.invoice_date)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Due Date:</Text>
            <Text style={styles.detailValue}>{formatDate(invoice.due_date)}</Text>
          </View>

          {/* Status badge - commented out for now, to be added later
          <View style={getStatusStyle('pending')}>
            <Text style={styles.statusText}>Pending</Text>
          </View>
          */}
        </View>
      </View>
    </View>
  );
};
