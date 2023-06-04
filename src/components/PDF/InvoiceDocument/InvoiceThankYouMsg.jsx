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

const InvoiceThankYouMsg = ({ invoice }) => (
  <View style={styles.titleContainer}>
    <Text style={styles.reportTitle}>{invoice?.cust_note}</Text>
  </View>
);

export default InvoiceThankYouMsg;
