import React, { useEffect, useState, useContext, Fragment } from 'react';
import { Flex, useDisclosure, Container, useToast, useColorModeValue } from '@chakra-ui/react';
//import {Link, Redirect, useHistory} from 'react-router-dom';
import { Link, useNavigate, useParams } from 'react-router-dom';
import supabase from '../../utils/supabaseClient.js';
import formatMoneyValue from '../../utils/formatMoneyValue.js';
import {
  EditQuoteForm,
  QuoteDetailsAddLineItemModal,
  QuoteDetailsHeader,
  QuoteDetailsMain,
  QuoteDetailsPane,
  QuoteDetailsPdfPreviewModal,
  QuoteDetailsQuickAction
} from '../../components/index.js';
import { useServices } from '../../hooks/useServices.jsx';
import { useQuoteStatuses } from '../../hooks/useQuoteStatuses.jsx';
import { useFetchQuoteById } from '../../hooks/useQuotes.jsx';

const QuoteById = (props) => {
  const { parentData } = props;
  const { id } = useParams();
  const toast = useToast();

  // Custom Hooks
  const { quoteById, isLoading } = useFetchQuoteById(id);
  const { services } = useServices();
  const { quoteStatuses } = useQuoteStatuses();

  // Modal useDisclousures
  const {
    isOpen: isAddLineItemOpen,
    onOpen: onAddLineItemOpen,
    onClose: onAddLineItemClose
  } = useDisclosure();
  const {
    isOpen: isEditQuoteOpen,
    onOpen: onEditQuoteOpen,
    onClose: onEditQuoteClose
  } = useDisclosure();
  const {
    isOpen: isExportPDFOpen,
    onOpen: onExportPDFOpen,
    onClose: onExportPDFClose
  } = useDisclosure();

  // React useState to store Objects
  const [quote, setQuote] = useState();
  const [selectedEditQuote, setSelectedEditQuote] = useState({
    id: '',
    quote_number: '',
    status_id: '',
    service_id: '',
    quote_date: '',
    issue_date: '',
    expiration_date: '',
    note: '',
    measurement_note: '',
    cust_note: ''
  });
  2;
  // React useState switches
  const [loadingQuoteStatusIsOn, setLoadingQuoteStatusIsOn] = useState(false);
  const [editSwitchIsOn, setEditSwitchIsOn] = useState(false);

  // React state input variables
  const [lineItemDescriptionInput, setLineItemDescriptionInput] = useState('');
  const [lineItemAmountInput, setLineItemAmountInput] = useState('');

  // Chakra UI states
  // const toast = useToast()

  // Custom color configs for UX elements
  const bgColorMode = useColorModeValue('gray.100', 'gray.600');
  const paymentCardBgColor = useColorModeValue('gray.100', 'gray.600');
  const paymentBorderColor = useColorModeValue('gray.200', 'gray.400');
  const secondaryTextColor = useColorModeValue('gray.600', 'gray.300');

  // React-Hooks
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef();
  let navigate = useNavigate();

  // Handle quote status when selected in menu
  const handleQuoteStatusMenuSelection = async (status_id) => {
    setLoadingQuoteStatusIsOn(true);
    if (status_id === quoteById?.status_id) {
      console.log(status_id);
    } else {
      const { data, error } = await supabase
        .from('quote')
        .update({ status_id: status_id })
        .eq('quote_number', id);

      if (error) {
        console.log(error);
      }
      console.log(data);
      // await getQuoteById();
    }
    setLoadingQuoteStatusIsOn(false);
  };

  //////////////////////// Functions to handle line items //////////////////////////////
  const handleLineItemDelete = async (item) => {
    const { data, error } = await supabase.from('quote_line_item').delete().eq('id', item.id);

    if (error) {
      toast({
        position: 'top',
        title: `Error Occurend Deleting Line Item 🚨`,
        description: `Error: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
    if (data) {
      // await getQuoteById();
      toast({
        position: 'top',
        title: `Succesfully Deleted Quote Line Item`,
        description: `We were able to delete a line item with description of "${
          item.description
        }" with an amount of "${formatMoneyValue(item.amount)}" successfully 🎉`,
        duration: 5000,
        isClosable: true,
        status: 'success'
      });
    }
  };

  const handleAddLineItemSubmit = async (e) => {
    e.preventDefault();
    setLoadingQuoteStatusIsOn(true);
    const { data, error } = await supabase.from('quote_line_item').insert({
      quote_id: quote.quote_number,
      service_id: quote.service_id,
      qty: 1,
      amount: lineItemAmountInput,
      description: lineItemDescriptionInput,
      fixed_item: true
    });

    if (error) {
      toast({
        position: 'top',
        title: `Error Occured Creating Line Item`,
        description: `Error: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
    if (data) {
      // await getQuoteById();
      setLoadingQuoteStatusIsOn(false);
      onAddLineItemClose();
      toast({
        position: 'top',
        title: `Succesfully Added Line Item`,
        description: `We were able to add a line-item for quote number ${quote.quote_number} 🎉`,
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    }
  };

  //////////////////////////// Functions that handle quote edit functionality /////////////////////////////////////////
  const handleEditQuoteOnChange = (e) => {
    setSelectedEditQuote({ ...selectedEditQuote, [e.target.name]: e.target.value });
  };

  const handleEditQuoteModal = (quote) => {
    setSelectedEditQuote({
      id: quote.id,
      quote_number: quote.quote_number,
      status_id: quote.status_id,
      service_id: quote.service_id,
      quote_date: quote.quote_date,
      issue_date: quote.issue_date,
      expiration_date: quote.expiration_date,
      note: quote.note,
      measurement_note: quote.measurement_note,
      cust_note: quote.cust_note
    });
    onEditQuoteOpen();
  };

  const handleEditQuoteSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('quote')
      .update({
        status_id: selectedEditQuote.status_id,
        service_id: selectedEditQuote.service_id,
        quote_date: selectedEditQuote.quote_date,
        issue_date: selectedEditQuote.issue_date,
        expiration_date: selectedEditQuote.expiration_date,
        note: selectedEditQuote.note,
        measurement_note: selectedEditQuote.measurement_note,
        cust_note: selectedEditQuote.cust_note,
        updated_at: new Date()
      })
      .eq('quote_number', selectedEditQuote.quote_number);

    if (error) {
      toast({
        position: 'top',
        title: `Error Updating Quote Number ${selectedEditQuote.quote_number}`,
        description: `Error: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      onEditQuoteClose();
    }

    if (data) {
      // await getQuoteById();
      onEditQuoteClose();
      toast({
        position: 'top',
        title: `Successfully Updated Quote!`,
        description: `We've updated INV# ${selectedEditQuote.quote_number} for you 🎉`,
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    }

    setSelectedEditQuote({
      id: '',
      quote_number: '',
      status_id: '',
      service_id: '',
      quote_date: '',
      issue_date: '',
      expiration_date: '',
      note: '',
      measurement_note: '',
      cust_note: ''
    });
  };

  // Convert Quote to Invoice
  // Handle adding new line item to quote
  const handlePDFDownload = () => {
    onExportPDFClose();
  };

  return (
    <Container maxW={'1400px'} mt={'1rem'} mb={'2rem'}>
      {/* <DeleteInvoiceLineServiceAlertDialog toast={handleDeleteToast} updateParentState={getInvoiceDetailsById} /> */}
      <QuoteDetailsHeader
        quoteById={quoteById}
        onExportPDFOpen={onExportPDFOpen}
        handleEditQuoteModal={handleEditQuoteModal}
      />
      <Flex px={'1rem'} gap={6} flexDir={{ base: 'column', lg: 'row' }}>
        {/* Left Section */}
        <Flex w={{ base: 'full', lg: '65%' }}>
          <QuoteDetailsMain
            quoteById={quoteById}
            paymentCardBgColor={paymentCardBgColor}
            secondaryTextColor={secondaryTextColor}
            handleLineItemDelete={handleLineItemDelete}
            editSwitchIsOn={editSwitchIsOn}
            bgColorMode={bgColorMode}
          />
        </Flex>
        {/* Right Section */}
        <Flex w={{ base: 'full', lg: '35%' }} direction={'column'} gap={4}>
          <QuoteDetailsQuickAction
            quoteById={quoteById}
            loadingQuoteStatusIsOn={loadingQuoteStatusIsOn}
            handleQuoteStatusMenuSelection={handleQuoteStatusMenuSelection}
            onAddLineItemOpen={onAddLineItemOpen}
            editSwitchIsOn={editSwitchIsOn}
            setEditSwitchIsOn={setEditSwitchIsOn}
          />
          <QuoteDetailsPane
            quoteById={quoteById}
            paymentCardBgColor={paymentCardBgColor}
            secondaryTextColor={secondaryTextColor}
          />
        </Flex>
      </Flex>
      <EditQuoteForm
        onClose={onEditQuoteClose}
        isOpen={isEditQuoteOpen}
        quote={selectedEditQuote}
        services={services}
        quoteStatuses={quoteStatuses}
        handleEditOnChange={handleEditQuoteOnChange}
        handleEditSubmit={handleEditQuoteSubmit}
      />
      {/* Export Quote PDF Preview */}
      <QuoteDetailsPdfPreviewModal
        quoteById={quoteById}
        onExportPDFClose={onExportPDFClose}
        isExportPDFOpen={isExportPDFOpen}
        handlePDFDownload={handlePDFDownload}
      />
      <QuoteDetailsAddLineItemModal
        handleAddLineItemSubmit={handleAddLineItemSubmit}
        onAddLineItemClose={onAddLineItemClose}
        isAddLineItemOpen={isAddLineItemOpen}
        setLineItemAmountInput={setLineItemAmountInput}
        setLineItemDescriptionInput={setLineItemDescriptionInput}
        loadingQuoteStatusIsOn={loadingQuoteStatusIsOn}
      />
    </Container>
  );
};

export default QuoteById;
