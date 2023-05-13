import React, { Fragment } from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { formatDate, formatNumber } from '../../../utils';

const styles = StyleSheet.create({
  invoiceNoContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 6
  },
  invoiceDateContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 36
  },
  invoiceDate: {
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
  invoiceDataText: {
    fontSize: 10,
    fontStyle: 'bold',
    width: '15%'
  },
  invoiceStatusBadge: {
    padding: 4,
    width: '15%',
    backgroundColor: '#ECC94B',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFFFFF'
  },
  invoicePaidStatusBadge: {
    padding: 4,
    width: '15%',
    backgroundColor: '#68D391',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFFFFF'
  },
  invoiceOverdueStatusBadge: {
    padding: 4,
    width: '15%',
    backgroundColor: '#FC8181',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFFFFF'
  },
  invoiceDraftStatusBadge: {
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

const InvoiceNo = ({ invoice }) => (
  <Fragment>
    <View style={styles.invoiceDateContainer}>
      <Text style={styles.label}>Date: </Text>
      <Text style={styles.invoiceDataText}>{formatDate(invoice?.invoice_date)}</Text>
    </View>
    <View style={styles.invoiceNoContainer}>
      <Text style={styles.label}>Invoice #:</Text>
      <Text style={styles.invoiceDataText}>{formatNumber(invoice?.invoice_number)}</Text>
    </View>
    <View style={styles.invoiceNoContainer}>
      <Text style={styles.label}>For:</Text>
      <Text style={styles.invoiceDataText}>{invoice?.service_type?.name}</Text>
    </View>
    <View style={styles.invoiceNoContainer}>
      <Text style={styles.statusLabel}>Status:</Text>
      <Text
        style={
          invoice?.invoice_status?.name === 'Pending'
            ? styles.invoiceStatusBadge
            : invoice?.invoice_status?.name === 'Paid'
            ? styles.invoicePaidStatusBadge
            : invoice?.invoice_status?.name === 'Overdue'
            ? styles.invoiceOverdueStatusBadge
            : invoice?.invoice_status?.name === 'Draft'
            ? styles.invoiceDraftStatusBadge
            : ''
        }>
        {invoice?.invoice_status?.name}
      </Text>
    </View>
  </Fragment>
);

export default InvoiceNo;
