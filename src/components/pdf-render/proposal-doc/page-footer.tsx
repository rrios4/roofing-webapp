import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { proposalStyles, MUTED_GRAY } from './proposal-styles';
import { COMPANY } from './proposal-content';

// Repeats on every physical page (including auto-flowed overflow pages)
// thanks to the `fixed` prop, matching the sample proposal's page footer.
export const PageFooter: React.FC = () => (
  <View style={proposalStyles.footer} fixed>
    <Text style={[proposalStyles.mutedText, { color: MUTED_GRAY }]}>
      RIOS{' '}
      <Text style={{ color: '#2563EB' }}>ROOFING</Text> SERVICES
    </Text>
    <Text
      style={[proposalStyles.mutedText, { color: MUTED_GRAY }]}
      render={({ pageNumber }) => `${pageNumber}`}
    />
  </View>
);

export default PageFooter;
