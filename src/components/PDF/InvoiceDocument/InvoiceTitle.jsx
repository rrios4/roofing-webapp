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
    letterSpacing: 4,
    fontSize: 25,
    textAlign: 'center',
    textTransform: 'uppercase'
  }
});

const InvoiceTitle = ({ title }) => (
  <View style={styles.titleContainer}>
    <Text style={styles.reportTitle}>Roofing Invoice</Text>
  </View>
);

export default InvoiceTitle;
