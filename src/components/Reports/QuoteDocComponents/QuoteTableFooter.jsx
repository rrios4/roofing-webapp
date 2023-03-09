import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { formatMoneyValue } from '../../../utils';

const borderColor = '#E2E8F0';
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderBottomColor: '#E2E8F0',
    borderBottomWidth: 1,
    alignItems: 'center',
    height: 24,
    fontSize: 12,
    fontStyle: 'bold'
  },
  description: {
    width: '85%',
    textAlign: 'right',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingRight: 8
  },
  total: {
    width: '15%',
    textAlign: 'right',
    paddingRight: 8
  }
});

const QuoteTableFooter = ({ items }) => {
  const total = items
    ?.map((item) => item.amount)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  return (
    <View style={styles.row}>
      <Text style={styles.description}>TOTAL</Text>
      <Text style={styles.total}>{formatMoneyValue(total)}</Text>
    </View>
  );
};

export default QuoteTableFooter;
