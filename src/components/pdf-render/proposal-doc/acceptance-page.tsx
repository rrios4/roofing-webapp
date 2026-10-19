import React from 'react';
import { Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { formatDate } from '../../../lib/utils';
import { proposalStyles, BORDER_GRAY } from './proposal-styles';
import { COMPANY } from './proposal-content';
import { ProposalDocumentData } from './proposal-types';
import { PageFooter } from './page-footer';

const styles = StyleSheet.create({
  signatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30
  },
  signatureCol: {
    width: '46%'
  },
  signatureHeading: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 20
  },
  signatureValue: {
    fontSize: 11,
    fontStyle: 'italic',
    marginBottom: 4
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: BORDER_GRAY,
    paddingTop: 3
  },
  signatureLabel: {
    fontSize: 8,
    color: '#6b7280'
  },
  blankLine: {
    height: 20
  }
});

interface AcceptancePageProps {
  quote: ProposalDocumentData;
}

export const AcceptancePage: React.FC<AcceptancePageProps> = ({ quote }) => {
  const customerName = quote.customer
    ? `${quote.customer.first_name || ''} ${quote.customer.last_name || ''}`.trim()
    : 'Homeowner';

  return (
    <Page size="A4" style={proposalStyles.page}>
      <Text style={proposalStyles.pageHeading}>Proposal Acceptance</Text>
      <Text style={proposalStyles.text}>
        To approve this roofing proposal and proceed with scheduling, simply affix your signature
        below. I, {customerName}, agree to the terms of this agreement (review terms and conditions
        section before signature please).
      </Text>

      <View style={styles.signatureRow}>
        <View style={styles.signatureCol}>
          <Text style={styles.signatureHeading}>Rios Roofing</Text>
          <Text style={styles.signatureValue}>{COMPANY.ownerName}</Text>
          <View style={styles.signatureLine}>
            <Text style={styles.signatureLabel}>Signature</Text>
          </View>

          <View style={{ marginTop: 20 }}>
            <Text style={styles.signatureValue}>{formatDate(quote.quote_date)}</Text>
            <View style={styles.signatureLine}>
              <Text style={styles.signatureLabel}>Date</Text>
            </View>
          </View>
        </View>

        <View style={styles.signatureCol}>
          <Text style={styles.signatureHeading}>Homeowner's Signature</Text>
          <View style={styles.blankLine} />
          <View style={styles.signatureLine}>
            <Text style={styles.signatureLabel}>Signature</Text>
          </View>

          <View style={{ marginTop: 20 }}>
            <View style={styles.blankLine} />
            <View style={styles.signatureLine}>
              <Text style={styles.signatureLabel}>Date</Text>
            </View>
          </View>
        </View>
      </View>

      <PageFooter />
    </Page>
  );
};

export default AcceptancePage;
