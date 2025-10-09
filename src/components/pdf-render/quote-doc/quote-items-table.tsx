import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { QuoteDocumentData } from '../modern-quote-doc';

interface QuoteItemsTableProps {
  quote: QuoteDocumentData;
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.3
  },
  table: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 4
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingVertical: 6,
    paddingHorizontal: 8
  },
  tableHeaderCell: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.3
  },
  descriptionHeader: {
    flex: 3
  },
  quantityHeader: {
    flex: 1,
    textAlign: 'center'
  },
  rateHeader: {
    flex: 1.2,
    textAlign: 'right'
  },
  amountHeader: {
    flex: 1.2,
    textAlign: 'right'
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingVertical: 6,
    paddingHorizontal: 8,
    minHeight: 24
  },
  lastRow: {
    borderBottomWidth: 0
  },
  tableCell: {
    fontSize: 8,
    color: '#1f2937'
  },
  descriptionCell: {
    flex: 3
  },
  quantityCell: {
    flex: 1,
    textAlign: 'center'
  },
  rateCell: {
    flex: 1.2,
    textAlign: 'right'
  },
  amountCell: {
    flex: 1.2,
    textAlign: 'right'
  },
  itemDescription: {
    fontSize: 8,
    color: '#1f2937',
    fontWeight: 'medium',
    marginBottom: 1
  },
  itemDetails: {
    fontSize: 7,
    color: '#6b7280'
  },
  emptyState: {
    padding: 20,
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 8,
    fontStyle: 'italic'
  }
});

export const QuoteItemsTable: React.FC<QuoteItemsTableProps> = ({ quote }) => {
  const formatMoney = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatQuantity = (quantity: number | null | undefined) => {
    if (quantity === null || quantity === undefined) return '0';
    return quantity.toString();
  };

  const calculateLineTotal = (qty: number | null, rate: number | null) => {
    if (!qty || !rate) return 0;
    return qty * rate;
  };

  // Check if we have line items, otherwise use fallback single service item
  const hasLineItems = quote.quote_line_item && quote.quote_line_item.length > 0;

  if (!hasLineItems) {
    // Fallback to single service item
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Quote Items</Text>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.descriptionHeader]}>Description</Text>
            <Text style={[styles.tableHeaderCell, styles.quantityHeader]}>Qty</Text>
            <Text style={[styles.tableHeaderCell, styles.rateHeader]}>Rate</Text>
            <Text style={[styles.tableHeaderCell, styles.amountHeader]}>Amount</Text>
          </View>

          {/* Single Service Row */}
          <View style={[styles.tableRow, styles.lastRow]}>
            <View style={styles.descriptionCell}>
              <Text style={styles.itemDescription}>{quote.service?.name || 'Roofing Service'}</Text>
              {quote.measurement_note && (
                <Text style={styles.itemDetails}>{quote.measurement_note}</Text>
              )}
            </View>
            <Text style={[styles.tableCell, styles.quantityCell]}>1</Text>
            <Text style={[styles.tableCell, styles.rateCell]}>Fixed</Text>
            <Text style={[styles.tableCell, styles.amountCell]}>{formatMoney(quote.total)}</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Quote Items</Text>
      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, styles.descriptionHeader]}>Description</Text>
          <Text style={[styles.tableHeaderCell, styles.quantityHeader]}>Qty</Text>
          <Text style={[styles.tableHeaderCell, styles.rateHeader]}>Rate</Text>
          <Text style={[styles.tableHeaderCell, styles.amountHeader]}>Amount</Text>
        </View>

        {/* Table Rows */}
        {quote.quote_line_item!.map((item, index) => {
          const isLastRow = index === (quote.quote_line_item?.length ?? 0) - 1;
          const lineTotal = calculateLineTotal(item.qty, item.rate);

          return (
            <View
              key={`${item.id || index}`}
              style={[styles.tableRow, ...(isLastRow ? [styles.lastRow] : [])]}>
              <View style={styles.descriptionCell}>
                <Text style={styles.itemDescription}>
                  {item.description || 'No description provided'}
                </Text>
                {item.sq_ft && <Text style={styles.itemDetails}>Square feet: {item.sq_ft}</Text>}
              </View>
              <Text style={[styles.tableCell, styles.quantityCell]}>
                {formatQuantity(item.qty)}
              </Text>
              <Text style={[styles.tableCell, styles.rateCell]}>
                {item.fixed_item ? 'Fixed' : formatMoney(item.rate)}
              </Text>
              <Text style={[styles.tableCell, styles.amountCell]}>{formatMoney(item.amount)}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};
