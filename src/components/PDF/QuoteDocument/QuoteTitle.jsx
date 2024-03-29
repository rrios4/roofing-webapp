import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24
  },
  reportTitle: {
    color: '#3182CE',
    letterSpacing: 1,
    fontSize: 25,
    fontWeight: 600,
    textAlign: 'center',
    textTransform: 'uppercase'
  }
});

const QuoteTitle = ({ title }) => (
  <View style={styles.titleContainer}>
    <Text style={styles.reportTitle}>Roofing Quote</Text>
  </View>
);

export default QuoteTitle;
