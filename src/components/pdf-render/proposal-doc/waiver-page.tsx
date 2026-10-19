import React from 'react';
import { Page, View, Text } from '@react-pdf/renderer';
import { formatDate } from '../../../lib/utils';
import { proposalStyles } from './proposal-styles';
import { waiverParagraphs, COMPANY } from './proposal-content';
import { ProposalDocumentData } from './proposal-types';
import { PageFooter } from './page-footer';

interface WaiverPageProps {
  quote: ProposalDocumentData;
}

export const WaiverPage: React.FC<WaiverPageProps> = ({ quote }) => (
  <Page size="A4" style={proposalStyles.page} wrap>
    <Text style={proposalStyles.pageHeading}>Accident Waiver and Release of Liability</Text>

    {waiverParagraphs.map((paragraph, index) => (
      <Text key={index} style={[proposalStyles.text, { marginBottom: 8 }]}>
        {paragraph}
      </Text>
    ))}

    <View style={{ marginTop: 16 }}>
      <Text style={proposalStyles.text}>
        X {COMPANY.ownerName} {formatDate(quote.quote_date)} X {COMPANY.ownerName}
      </Text>
      <Text style={proposalStyles.mutedText}>Participant's Signature Date Participant's Name</Text>
    </View>

    <PageFooter />
  </Page>
);

export default WaiverPage;
