import React from 'react';
import { Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { proposalStyles, BRAND_BLUE_DARK } from './proposal-styles';
import { techniques, techniquesClosing } from './proposal-content';
import { PageFooter } from './page-footer';

const styles = StyleSheet.create({
  techniqueBlock: {
    marginBottom: 12,
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: BRAND_BLUE_DARK
  },
  techniqueTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: BRAND_BLUE_DARK,
    marginBottom: 3
  }
});

export const TechniquesPage: React.FC = () => (
  <Page size="A4" style={proposalStyles.page}>
    <Text style={proposalStyles.pageHeading}>Our Signature Techniques</Text>
    <Text style={[proposalStyles.text, { marginBottom: 16 }]}>
      At Rios Roofing, we are dedicated to providing exceptional roofing services that guarantee
      protection and durability. Our commitment to quality ensures that your roof is built to last,
      safeguarding your home against leaks and harsh weather conditions. Here are the signature
      techniques that set us apart:
    </Text>

    {techniques.map((technique, index) => (
      <View key={index} style={styles.techniqueBlock}>
        <Text style={styles.techniqueTitle}>{technique.title}</Text>
        <Text style={proposalStyles.text}>{technique.description}</Text>
      </View>
    ))}

    <Text style={[proposalStyles.text, { marginTop: 8 }]}>{techniquesClosing}</Text>

    <PageFooter />
  </Page>
);

export default TechniquesPage;
