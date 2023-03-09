import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const borderColor = '#E2E8F0';
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#EDF2F7',
    borderBottomWidth: 1,
    alignItems: 'center',
    height: 24,
    textAlign: 'center',
    fontStyle: 'bold',
    flexGrow: 1
  },
  description: {
    width: '60%',
    borderRightColor: borderColor,
    borderRightWidth: 1
  },
  qty: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1
  },
  rate: {
    width: '15%',
    borderRightColor: borderColor,
    borderRightWidth: 1
  },
  amount: {
    width: '15%'
  }
});

const QuoteTableHeader = () => (
  <View style={styles.container}>
    <Text style={styles.description}>Item Description</Text>
    <Text style={styles.qty}>Qty</Text>
    <Text style={styles.rate}>Rate</Text>
    <Text style={styles.amount}>Amount</Text>
  </View>
);

export default QuoteTableHeader;
