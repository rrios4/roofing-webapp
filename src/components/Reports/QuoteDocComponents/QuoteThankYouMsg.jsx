import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    marginTop: 24,
    justifyContent: 'center'
  },
  reportTitle: {
    fontSize: 10,
    textAlign: 'center',
    textTransform: 'uppercase'
  }
});

const QuoteThankYouMsg = ({ quote }) => (
  <View style={styles.titleContainer}>
    <Text style={styles.reportTitle}>Thank You For Your Business!</Text>
  </View>
);

export default QuoteThankYouMsg;
