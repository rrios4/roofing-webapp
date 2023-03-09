import React from 'react';
import { View, StyleSheet } from '@react-pdf/renderer';
import QuoteTableHeader from './QuoteTableHeader';
import QuoteTableRow from './QuoteTableRow';
import QuoteTableFooter from './QuoteTableFooter';

// const tableRowsCount = 5;

const styles = StyleSheet.create({
  tableContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#EDF2F7'
  }
});

const QuoteItemsTable = ({ quote }) => (
  <View style={styles.tableContainer}>
    <QuoteTableHeader />
    <QuoteTableRow items={quote?.quote_line_item} />
    {/* <QuoteTableBlankSpace rowsCount={tableRowsCount - Quote?.Quote_line_service?.length} /> */}
    <QuoteTableFooter items={quote?.quote_line_item} />
  </View>
);

export default QuoteItemsTable;
