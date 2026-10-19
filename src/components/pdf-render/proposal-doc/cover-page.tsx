import React from 'react';
import { Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { formatDate } from '../../../lib/utils';
import { proposalStyles, BRAND_BLUE_DARK } from './proposal-styles';
import { COMPANY } from './proposal-content';
import { ProposalDocumentData } from './proposal-types';

const TEXT_MUTED = '#4b5563';

const styles = StyleSheet.create({
  page: {
    ...proposalStyles.page,
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0
  },
  brandBand: {
    backgroundColor: BRAND_BLUE_DARK,
    width: 61,
    minHeight: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0
  },
  content: {
    marginLeft: 61,
    flexGrow: 1,
    paddingTop: 40,
    paddingBottom: 40,
    paddingLeft: 36,
    paddingRight: 36,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 60
  },
  logo: {
    width: 100,
    height: 30
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#111827',
    lineHeight: 1.1,
    marginBottom: 4,
    marginTop: 40
  },
  subtitle: {
    fontSize: 16,
    color: TEXT_MUTED,
    lineHeight: 1.2,
    marginBottom: 40
  },
  heroImage: {
    width: '100%',
    height: 220,
    borderRadius: 6,
    marginBottom: 40,
    objectFit: 'cover'
  },
  metaLabel: {
    fontSize: 9,
    color: TEXT_MUTED,
    marginBottom: 1
  },
  metaValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 9
  }
});

interface CoverPageProps {
  quote: ProposalDocumentData;
}

export const CoverPage: React.FC<CoverPageProps> = ({ quote }) => {
  const customerName = quote.customer
    ? `${quote.customer.first_name || ''} ${quote.customer.last_name || ''}`.trim()
    : '';
  const propertyType = quote.customer?.customer_type?.name || 'Residential Home';
  const serviceName = quote.service?.name || 'New Roof Installation';

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.brandBand} fixed />
      <View style={styles.content}>
        <View>
          <View style={styles.headerRow}>
            <Image
              style={styles.logo}
              src="/assets/roofing-proposal/roofing-proposal-rios-roofing-logo.png"
            />
            <Text style={[proposalStyles.mutedText, { fontSize: 9 }]}>{COMPANY.website}</Text>
          </View>

          <Text style={styles.title}>Roofing Proposal</Text>
          <Text style={styles.subtitle}>{serviceName}</Text>

          <Image
            style={styles.heroImage}
            src="/assets/roofing-proposal/roofing-proposal-cover.jpg"
          />
        </View>

        <View>
          <Text style={styles.metaLabel}>Prepared for</Text>
          <Text style={styles.metaValue}>{customerName || 'Valued Customer'}</Text>
          <Text style={styles.metaLabel}>{propertyType}</Text>

          <View style={{ marginTop: 20 }}>
            <Text style={styles.metaLabel}>Proposal Issued</Text>
            <Text style={styles.metaValue}>{formatDate(quote.quote_date)}</Text>

            <Text style={styles.metaLabel}>Proposal Valid To</Text>
            <Text style={styles.metaValue}>{formatDate(quote.expiration_date)}</Text>
          </View>
        </View>
      </View>
    </Page>
  );
};

export default CoverPage;
