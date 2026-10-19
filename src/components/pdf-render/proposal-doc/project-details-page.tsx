import React from 'react';
import { Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { proposalStyles, BRAND_BLUE_DARK } from './proposal-styles';
import { projectDetailsSteps, projectDetailsClosing } from './proposal-content';
import { PageFooter } from './page-footer';

const styles = StyleSheet.create({
  stepBlock: {
    marginBottom: 8
  },
  stepTitle: {
    fontSize: 9.5,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 3
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 2,
    paddingLeft: 10
  }
});

export const ProjectDetailsPage: React.FC = () => (
  <Page size="A4" style={proposalStyles.page}>
    <Text style={proposalStyles.pageHeading}>Project Details</Text>
    <Text style={[proposalStyles.text, { marginBottom: 12 }]}>
      We are committed to providing a comprehensive and professional roof installation service.
      Below is a detailed outline of the work that will be conducted as part of your roofing
      project:
    </Text>

    {projectDetailsSteps.map((step, index) => (
      <View key={index} style={styles.stepBlock} wrap={false}>
        <Text style={styles.stepTitle}>
          {index + 1}. {step.title}
        </Text>
        {step.bullets.map((bullet, bulletIndex) => (
          <View key={bulletIndex} style={styles.bulletRow}>
            <Text style={[proposalStyles.bulletMarker, { color: BRAND_BLUE_DARK }]}>-</Text>
            <Text style={proposalStyles.bulletText}>{bullet}</Text>
          </View>
        ))}
      </View>
    ))}

    <Text style={[proposalStyles.text, { marginTop: 8 }]}>{projectDetailsClosing}</Text>

    <PageFooter />
  </Page>
);

export default ProjectDetailsPage;
