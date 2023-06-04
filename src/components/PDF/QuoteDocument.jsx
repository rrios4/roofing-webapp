import React, { Fragment } from 'react';
import { Page, Document, Image, StyleSheet, Text, View } from '@react-pdf/renderer';
import { QuoteTitle, QuoteNo, QuoteBillTo, QuoteItemsTable, QuoteThankYouMsg } from '..';

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
  extraInfoText: {
    marginTop: 10
  },
  serviceNoteContainer: {
    marginTop: 12,
    marginBottom: 6,
    width: '50%',
    paddingHorizontal: '1rem',
    marginHorizontal: '4'
  },
  serviceNoteTitleLabel: {
    marginTop: 6,
    marginBottom: 6,
    fontWeight: 800
  },
  containerForNoteAndServiceContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    gap: '4'
  }
});

const QuoteDocument = ({ quote }) => {
  return (
    <Document>
      <Page size={'A4'} style={styles.page}>
        <Image style={styles.logo} src={'/LogoRR.png'} />
        <QuoteTitle />
        <QuoteNo quote={quote} />
        <QuoteBillTo quote={quote} />
        <QuoteItemsTable quote={quote} />
        <View style={styles.containerForNoteAndServiceContainer}>
          {/* Service Note */}
          <View style={styles.serviceNoteContainer}>
            <Text style={styles.serviceNoteTitleLabel}>Note:</Text>
            {/* <Text>{quote?.cust_note}</Text> */}
            <Text>{quote?.public_note}</Text>
          </View>
          <View style={styles.serviceNoteContainer}>
            <Text style={styles.serviceNoteTitleLabel}>Service Includes:</Text>
            {/* <Text>{quote?.cust_note}</Text> */}
            <Text>{quote?.services?.description}</Text>
            {quote?.services?.name === 'Roof Installation' ? (
              <Text style={styles.serviceNoteTitleLabel}>
                In order to initiate the roofing process promptly, we kindly request a down payment
                of 50% of the total quoted amount, which will be allocated towards the procurement
                of necessary materials.
              </Text>
            ) : (
              <Text></Text>
            )}
          </View>
        </View>
        {/* Extra Info Component */}
        <View>
          <Text style={styles.extraInfoText}>{quote?.cust_note}</Text>
        </View>
        <QuoteThankYouMsg quote={quote} />
      </Page>
    </Document>
  );
};

export default QuoteDocument;
