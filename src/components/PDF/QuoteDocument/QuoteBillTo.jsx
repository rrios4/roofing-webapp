import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 36,
    flexDirection: 'row',
    gap: '10'
  },
  billTo: {
    marginTop: 20,
    paddingBottom: 8,
    fontFamily: 'Helvetica-Oblique',
    fontWeight: 'bold'
  },
  rightItem: {
    paddingLeft: 36
  },
  mainText: {
    paddingBottom: 4
  },
  subText: {
    paddingBottom: 2
  }
});

const QuoteBillTo = ({ quote }) => (
  <View style={styles.headerContainer}>
    <View>
      <Text style={styles.billTo}>From:</Text>
      <Text style={styles.mainText}>Rios Roofing</Text>
      <Text style={styles.subText}>150 Tallant St</Text>
      <Text style={styles.mainText}>Houston, TX 77076</Text>
      <Text style={styles.mainText}>832-310-3593</Text>
      <Text style={styles.mainText}>rrios.roofing@gmail.com</Text>
    </View>
    {quote.custom_address === true ? (
      <>
        <View style={styles.rightItem}>
          <Text style={styles.billTo}>To:</Text>
          <Text style={styles.mainText}>
            {quote?.customer?.first_name} {quote?.customer?.last_name}
          </Text>
          <Text style={styles.subText}>{quote?.custom_street_address}</Text>
          <Text style={styles.mainText}>
            {quote?.custom_city}, {quote?.custom_state} {quote?.custom_zipcode}
          </Text>
          <Text style={styles.mainText}>{quote?.customer?.phone_number}</Text>
          <Text style={styles.mainText}>{quote?.customer?.email}</Text>
        </View>
      </>
    ) : (
      <>
        <View style={styles.rightItem}>
          <Text style={styles.billTo}>To:</Text>
          <Text style={styles.mainText}>
            {quote?.customer?.first_name} {quote?.customer?.last_name}
          </Text>
          <Text style={styles.subText}>{quote?.customer?.street_address}</Text>
          <Text style={styles.mainText}>
            {quote?.customer?.city}, {quote?.customer?.state} {quote?.customer?.zipcode}
          </Text>
          <Text style={styles.mainText}>{quote?.customer?.phone_number}</Text>
          <Text style={styles.mainText}>{quote?.customer?.email}</Text>
        </View>
      </>
    )}
  </View>
);

export default QuoteBillTo;
