import React from 'react';
import { Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { proposalStyles, BORDER_GRAY, BRAND_BLUE_DARK } from './proposal-styles';
import { planOfAction, planOfActionIntro } from './proposal-content';
import { PageFooter } from './page-footer';

const styles = StyleSheet.create({
  block: {
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_GRAY
  },
  rangeLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: BRAND_BLUE_DARK,
    marginBottom: 4
  }
});

export const PlanOfActionPage: React.FC = () => (
  <Page size="A4" style={proposalStyles.page}>
    <Text style={proposalStyles.pageHeading}>Plan of Action</Text>
    <Text style={[proposalStyles.text, { marginBottom: 16 }]}>{planOfActionIntro}</Text>

    {planOfAction.map((item, index) => (
      <View key={index} style={styles.block}>
        <Text style={styles.rangeLabel}>{item.range}</Text>
        <Text style={proposalStyles.text}>{item.description}</Text>
      </View>
    ))}

    <PageFooter />
  </Page>
);

export default PlanOfActionPage;
