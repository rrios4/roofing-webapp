import React, { Fragment } from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { formatDate, formatNumber } from '../../../utils';

const styles = StyleSheet.create({
  quoteNoContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 6
  },
  quoteDateContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 36
  },
  quoteDate: {
    fontSize: 12,
    fontStyle: 'bold',
    width: '30%'
  },
  label: {
    width: '15%',
    fontStyle: 'extrabold'
  },
  statusLabel: {
    width: '15%',
    fontStyle: 'extrabold',
    paddingTop: 4
  },
  quoteDataText: {
    fontSize: 10,
    fontStyle: 'bold',
    width: '15%'
  },
  quoteStatusBadge: {
    padding: 4,
    width: '15%',
    backgroundColor: '#ECC94B',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFFFFF'
  },
  quotePaidStatusBadge: {
    padding: 4,
    width: '15%',
    backgroundColor: '#68D391',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFFFFF'
  },
  quoteOverdueStatusBadge: {
    padding: 4,
    width: '15%',
    backgroundColor: '#FC8181',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFFFFF'
  },
  quoteDraftStatusBadge: {
    padding: 4,
    width: '15%',
    backgroundColor: '#A0AEC0',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFFFFF'
  }
});

const QuoteNo = ({ quote }) => (
  <Fragment>
    <View style={styles.quoteDateContainer}>
      <Text style={styles.label}>Date: </Text>
      <Text style={styles.quoteDataText}>{formatDate(quote?.quote_date)}</Text>
    </View>
    <View style={styles.quoteNoContainer}>
      <Text style={styles.label}>Quote #:</Text>
      <Text style={styles.quoteDataText}>{formatNumber(quote?.quote_number)}</Text>
    </View>
    <View style={styles.quoteNoContainer}>
      <Text style={styles.label}>For:</Text>
      <Text style={styles.quoteDataText}>{quote?.services?.name}</Text>
    </View>
    <View style={styles.quoteNoContainer}>
      <Text style={styles.statusLabel}>Status:</Text>
      <Text
        style={
          quote?.quote_status?.name === 'Pending'
            ? styles.quoteStatusBadge
            : quote?.quote_status?.name === 'Accepted'
            ? styles.quotePaidStatusBadge
            : quote?.quote_status?.name === 'Rejected'
            ? styles.quoteOverdueStatusBadge
            : quote?.quote_status?.name === 'Draft'
            ? styles.quoteDraftStatusBadge
            : ''
        }>
        {quote?.quote_status?.name}
      </Text>
    </View>
  </Fragment>
);

export default QuoteNo;
