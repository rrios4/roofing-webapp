import React from 'react';
import { Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { proposalStyles } from './proposal-styles';
import { termsClauses } from './proposal-content';
import { PageFooter } from './page-footer';

const styles = StyleSheet.create({
  clauseRow: {
    flexDirection: 'row',
    marginBottom: 7
  },
  clauseNumber: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#111827',
    width: 16
  },
  clauseText: {
    fontSize: 9,
    color: '#1f2937',
    flex: 1
  }
});

// Terms are long enough to auto-flow across multiple physical PDF pages;
// react-pdf handles pagination automatically within a single <Page> that
// has wrap enabled (the default), repeating the fixed footer on each.
export const TermsPage: React.FC = () => (
  <Page size="A4" style={proposalStyles.page} wrap>
    <Text style={proposalStyles.pageHeading}>Terms and Conditions</Text>

    {termsClauses.map((clause, index) => (
      <View key={index} style={styles.clauseRow} wrap={false}>
        <Text style={styles.clauseNumber}>{index + 1}.</Text>
        <Text style={styles.clauseText}>{clause}</Text>
      </View>
    ))}

    <PageFooter />
  </Page>
);

export default TermsPage;
