import React, { Fragment } from 'react';
import { Page, Document, Image, StyleSheet, Text, View } from '@react-pdf/renderer';
import { formatMoneyValue, formatDate } from '../../utils';
import {
  InvoiceTableHeader,
  InvoiceTableRow,
  InvoiceTableBlankSpace,
  InvoiceTableFooter,
  InvoiceThankYouMsg,
  InvoiceTitle,
  InvoiceNo,
  InvoiceBillTo,
  InvoiceItemsTable
} from '..';

const styles = StyleSheet.create({
  page: {
    fontSize: 11,
    paddingTop: 30,
    paddingLeft: 60,
    paddingRight: 60,
    lineHeight: 1,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF'
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 'auto',
    marginLeft: 'auto',
    padding: 4,
    backgroundColor: '#3182CE',
    borderRadius: 100
  },
  amountDueContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 4,
    marginTop: 24,
    marginBottom: 24
  },
  amountDueText: {
    flexDirection: 'row',
    fontSize: 12,
    padding: 8,
    backgroundColor: '#4299E1',
    borderRadius: 10,
    color: '#FFFFFF'
  },
  amountDueTextPadding: {
    paddingLeft: 4,
    paddingRight: 4
  },
  paymentsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 1,
    marginTop: 12
  },
  paymentDateTextPadding: {
    width: '20%',
    paddingLeft: 8,
    paddingRight: 8
  },
  paymentMethodTextPadding: {
    width: '20%',
    paddingLeft: 8,
    paddingRight: 8
  },
  paymentAmountTextPadding: {
    width: '15%',
    paddingLeft: 8,
    paddingRight: 8
  },
  extraInfoText: {
    marginTop: 6
  },
  serviceNoteContainer: {
    marginTop: 12,
    marginBottom: 6,
    width: '50%',
    paddingHorizontal: '1rem',
    marginHorizontal: '4'
  },
  label: {
    fontWeight: 600,
    paddingBottom: '4'
  }
});

const InvoiceDocument = (props) => {
  const { invoice } = props;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Image style={styles.logo} src={'/LogoRR.png'} />
        <InvoiceTitle />
        <InvoiceNo invoice={invoice} />
        <InvoiceBillTo invoice={invoice} />
        <InvoiceItemsTable invoice={invoice} />
        {/* Payments Component */}
        {invoice?.invoice_payment?.map((item, index) => (
          <Fragment key={index}>
            <View style={styles.paymentsContainer}>
              <Text style={styles.paymentDateTextPadding}>{formatDate(item.date_received)}</Text>
              <Text style={styles.paymentMethodTextPadding}>{item.payment_method}</Text>
              <Text style={styles.paymentAmountTextPadding}>{formatMoneyValue(item.amount)}</Text>
            </View>
          </Fragment>
        ))}
        {/* Amount Due Component */}
        <View style={styles.amountDueContainer}>
          <View style={styles.amountDueText}>
            <Text style={styles.amountDueTextPadding}>Amount Due: </Text>
            <Text style={styles.amountDueTextPadding}>
              $ {formatMoneyValue(invoice?.amount_due)}
            </Text>
          </View>
        </View>
        {/* Note */}
        <View style={styles.serviceNoteContainer}>
          <Text style={styles.label}>Note:</Text>
          {/* <Text>{quote?.cust_note}</Text> */}
          <Text>{invoice?.public_note}</Text>
        </View>
        {/* Extra Info Component */}
        <View>
          <Text style={styles.extraInfoText}>Make all checks payable to RIOS ROOFING</Text>
          <Text style={styles.extraInfoText}>
            If you have any questions concerning this invoice, Contact Name, Phone Number, E-mail
          </Text>
        </View>
        <InvoiceThankYouMsg invoice={invoice} />
      </Page>
    </Document>
  );
};

export default InvoiceDocument;
