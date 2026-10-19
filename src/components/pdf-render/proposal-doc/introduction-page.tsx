import React from 'react';
import { Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { proposalStyles } from './proposal-styles';
import { introParagraph, introBullets, introClosing } from './proposal-content';
import { ProposalDocumentData } from './proposal-types';
import { PageFooter } from './page-footer';

const styles = StyleSheet.create({
  photoGrid: {
    marginBottom: 14
  },
  photoRow: {
    flexDirection: 'row',
    marginBottom: 8
  },
  photo: {
    width: 220,
    height: 130,
    borderRadius: 4,
    objectFit: 'cover'
  },
  photoSpacer: {
    width: 8
  }
});

interface IntroductionPageProps {
  quote: ProposalDocumentData;
}

export const IntroductionPage: React.FC<IntroductionPageProps> = ({ quote }) => {
  const address = quote.custom_address
    ? [
        quote.custom_street_address,
        `${quote.custom_city || ''}, ${quote.custom_state || ''} ${quote.custom_zipcode || ''}`
      ]
    : [
        quote.customer?.street_address,
        `${quote.customer?.city || ''}, ${quote.customer?.state || ''} ${quote.customer?.zipcode || ''}`
      ];
  const customerName = quote.customer
    ? `${quote.customer.first_name || ''} ${quote.customer.last_name || ''}`.trim()
    : 'the customer';

  return (
    <Page size="A4" style={proposalStyles.page}>
      <Text style={proposalStyles.pageHeading}>Introduction</Text>
      <Text style={[proposalStyles.text, { marginBottom: 14 }]}>{introParagraph}</Text>

      <View style={styles.photoGrid}>
        <View style={styles.photoRow}>
          <Image style={styles.photo} src="/assets/roofing-proposal/proposal-page-2-grid-1.jpg" />
          <View style={styles.photoSpacer} />
          <Image style={styles.photo} src="/assets/roofing-proposal/proposal-page-2-grid-2.jpg" />
        </View>
        <View style={[styles.photoRow, { marginBottom: 0 }]}>
          <Image style={styles.photo} src="/assets/roofing-proposal/proposal-page-2-grid-3.jpg" />
          <View style={styles.photoSpacer} />
          <Image style={styles.photo} src="/assets/roofing-proposal/proposal-page-2-grid-4.jpg" />
        </View>
      </View>

      <View style={[proposalStyles.infoBox, { marginBottom: 14 }]}>
        <Text style={[proposalStyles.text, { marginBottom: 4 }]}>
          This roofing proposal is for {customerName}'s property located at{' '}
          <Text style={proposalStyles.bold}>
            {address[0]}, {address[1]}
          </Text>
          . This proposal is for a complete roof replacement. The proposal is valid for 30 days from
          the date it was issued.
        </Text>
      </View>

      <Text style={[proposalStyles.text, { marginBottom: 6 }]}>
        We are offering you the most appropriate roofing options for your budget and needs, by
        taking care of the following:
      </Text>

      <View style={{ marginBottom: 14 }}>
        {introBullets.map((bullet, index) => (
          <View key={index} style={proposalStyles.bulletRow}>
            <Text style={proposalStyles.bulletMarker}>•</Text>
            <Text style={proposalStyles.bulletText}>{bullet}</Text>
          </View>
        ))}
      </View>

      <Text style={proposalStyles.text}>{introClosing}</Text>

      <PageFooter />
    </Page>
  );
};

export default IntroductionPage;
