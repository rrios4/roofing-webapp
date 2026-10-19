import React from 'react';
import { Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { proposalStyles, BORDER_GRAY, TOTAL_BG, BRAND_BLUE_DARK } from './proposal-styles';
import { materialsRows, downPaymentNote, DEFAULT_SHINGLE } from './proposal-content';
import { ProposalDocumentData } from './proposal-types';
import { PageFooter } from './page-footer';

const styles = StyleSheet.create({
  table: {
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 4,
    marginBottom: 16
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderBottomWidth: 1,
    borderBottomColor: BORDER_GRAY,
    paddingVertical: 6,
    paddingHorizontal: 8
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingVertical: 6,
    paddingHorizontal: 8
  },
  labelCol: {
    flex: 1.1,
    fontSize: 8,
    fontWeight: 'bold',
    color: '#111827'
  },
  detailsCol: {
    flex: 2,
    fontSize: 8,
    color: '#374151'
  },
  summaryBox: {
    width: '55%',
    marginLeft: 'auto',
    backgroundColor: '#f9fafb',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: BORDER_GRAY
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6'
  },
  totalRow: {
    backgroundColor: TOTAL_BG,
    borderBottomWidth: 0,
    borderTopWidth: 2,
    borderTopColor: BRAND_BLUE_DARK
  }
});

const formatMoney = (amount: number | null | undefined) => {
  if (amount === null || amount === undefined) return '$0.00';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

interface MaterialsPageProps {
  quote: ProposalDocumentData;
}

export const MaterialsPage: React.FC<MaterialsPageProps> = ({ quote }) => {
  const shingleBrand = quote.shingle_brand || DEFAULT_SHINGLE.brand;
  const shingleModel = quote.shingle_model || DEFAULT_SHINGLE.model;
  const shingleColor = quote.shingle_color || DEFAULT_SHINGLE.color;

  return (
    <Page size="A4" style={proposalStyles.page}>
      <Text style={proposalStyles.pageHeading}>Roofing System Materials</Text>
      <Text style={[proposalStyles.text, { marginBottom: 12 }]}>
        Our Premium Architectural Roofing System is designed to provide your home with the highest
        quality protection and an elegant appearance. We use top-of-the-line architectural shingles
        from leading brands like Tamko, Owens Corning, GAF, and CertainTeed, ensuring durability and
        long-lasting performance.
      </Text>

      <View style={styles.table}>
        <View style={styles.headerRow}>
          <Text style={[styles.labelCol, { fontSize: 8, color: '#374151' }]}>Description</Text>
          <Text style={[styles.detailsCol, { fontSize: 8, color: '#374151' }]}>Details</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.labelCol}>30-Year Architectural Asphalt Shingles</Text>
          <Text style={styles.detailsCol}>
            Brand: {shingleBrand}, Model: {shingleModel}, Color: {shingleColor}
          </Text>
        </View>

        {materialsRows.map((row, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.labelCol}>{row.label}</Text>
            <Text style={styles.detailsCol}>{row.details}</Text>
          </View>
        ))}
      </View>

      <View style={styles.summaryBox}>
        <View style={styles.summaryRow}>
          <Text style={[proposalStyles.text, { fontSize: 9 }]}>Subtotal:</Text>
          <Text style={[proposalStyles.text, { fontSize: 9 }]}>{formatMoney(quote.subtotal)}</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text
            style={[
              proposalStyles.text,
              { fontSize: 10, fontWeight: 'bold', color: BRAND_BLUE_DARK }
            ]}>
            Total
          </Text>
          <Text
            style={[
              proposalStyles.text,
              { fontSize: 10, fontWeight: 'bold', color: BRAND_BLUE_DARK }
            ]}>
            {formatMoney(quote.total)}
          </Text>
        </View>
      </View>

      <Text style={[proposalStyles.text, { marginTop: 12, fontStyle: 'italic' }]}>
        {downPaymentNote}
      </Text>

      <PageFooter />
    </Page>
  );
};

export default MaterialsPage;
