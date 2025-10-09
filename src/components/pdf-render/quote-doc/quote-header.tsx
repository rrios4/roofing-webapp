import React from 'react';
import { Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { formatDate, formatNumber } from '../../../lib/utils';
import { QuoteDocumentData } from '../modern-quote-doc';

interface QuoteHeaderProps {
  quote: QuoteDocumentData;
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
  quoteDetails: {
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
    width: 55,
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
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statusBadgeAccepted: {
    backgroundColor: '#10b981'
  },
  statusBadgeExpired: {
    backgroundColor: '#ef4444'
  },
  statusBadgeRejected: {
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

export const QuoteHeader: React.FC<QuoteHeaderProps> = ({ quote }) => {
  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
      case 'approved':
        return [styles.statusBadge, styles.statusBadgeAccepted];
      case 'expired':
        return [styles.statusBadge, styles.statusBadgeExpired];
      case 'rejected':
        return [styles.statusBadge, styles.statusBadgeRejected];
      default:
        return styles.statusBadge;
    }
  };

  // Check if quote is expired
  const isExpired = () => {
    if (!quote.expiration_date) return false;
    const expirationDate = new Date(quote.expiration_date);
    const today = new Date();
    return expirationDate < today;
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.logoSection}>
        <Image style={styles.logo} src="/public/company-logo.png" />
        <Text style={styles.companyName}>RIOS ROOFING</Text>
        <Text style={styles.companyTagline}>Professional Roofing Services</Text>
      </View>

      <View style={styles.quoteSection}>
        <Text style={styles.quoteTitle}>QUOTE</Text>

        <View style={styles.quoteDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Quote #:</Text>
            <Text style={styles.detailValue}>QT-{formatNumber(quote.quote_number || 0)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Quote Date:</Text>
            <Text style={styles.detailValue}>{formatDate(quote.quote_date)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Expires:</Text>
            <Text style={styles.detailValue}>{formatDate(quote.expiration_date)}</Text>
          </View>

          {/* Status badge */}
          <View style={getStatusStyle((quote as any).quote_status?.name || '')}>
            <Text style={styles.statusText}>
              {isExpired() ? 'Expired' : (quote as any).quote_status?.name || 'Active'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
