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

const InvoiceBillTo = ({ invoice }) => (
  <View style={styles.headerContainer}>
    <View>
      <Text style={styles.billTo}>From:</Text>
      <Text style={styles.mainText}>Rios Roofing</Text>
      <Text style={styles.subText}>150 Tallant St</Text>
      <Text style={styles.mainText}>Houston, TX 77076</Text>
      <Text style={styles.mainText}>832-310-3593</Text>
      <Text style={styles.mainText}>rrios.roofing@gmail.com</Text>
    </View>
    {invoice?.bill_to === true ? (
      <>
        <View style={styles.rightItem}>
          <Text style={styles.billTo}>To:</Text>
          <Text style={styles.mainText}>
            {invoice?.customer?.first_name} {invoice?.customer?.last_name}
          </Text>
          <Text style={styles.subText}>{invoice?.bill_to_street_address}</Text>
          <Text style={styles.mainText}>
            {invoice?.bill_to_city}, {invoice?.bill_to_state} {invoice?.bill_to_zipcode}
          </Text>
          <Text style={styles.mainText}>{invoice?.customer?.phone_number}</Text>
          <Text style={styles.mainText}>{invoice?.customer?.email}</Text>
        </View>
      </>
    ) : (
      <>
        <View style={styles.rightItem}>
          <Text style={styles.billTo}>To:</Text>
          <Text style={styles.mainText}>
            {invoice?.customer?.first_name} {invoice?.customer?.last_name}
          </Text>
          <Text style={styles.subText}>{invoice?.customer?.street_address}</Text>
          <Text style={styles.mainText}>
            {invoice?.customer?.city}, {invoice?.customer?.state} {invoice?.customer?.zipcode}
          </Text>
          <Text style={styles.mainText}>{invoice?.customer?.phone_number}</Text>
          <Text style={styles.mainText}>{invoice?.customer?.email}</Text>
        </View>
      </>
    )}
  </View>
);

export default InvoiceBillTo;
