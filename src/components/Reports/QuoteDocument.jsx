import React, { Fragment } from 'react';
import { Page, Document, Image, StyleSheet, Text, View } from '@react-pdf/renderer';
import { QuoteTitle } from '../';

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
    width: 60,
    height: 60,
    marginRight: 'auto',
    marginLeft: 'auto',
    padding: 4,
    backgroundColor: '#3182CE',
    borderRadius: 100
  }
});

const QuoteDocument = () => {
  return (
    <Document>
      <Page size={'A4'} style={styles.page}>
        <Image style={styles.logo} src={'/LogoRR.png'} />
        <QuoteTitle />
      </Page>
    </Document>
  );
};

export default QuoteDocument;
