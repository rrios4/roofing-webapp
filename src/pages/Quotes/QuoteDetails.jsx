import React, { useState } from 'react';
//import {Link, Redirect, useHistory} from 'react-router-dom';
import { useParams } from 'react-router-dom';
import supabase from '../../utils/supabaseClient.js';
import { useServices } from '../../hooks/useServices.jsx';
import { useQuoteStatuses } from '../../hooks/useQuoteStatuses.jsx';
import { useFetchQuoteById, useUpdateQuoteStatusById } from '../../hooks/useQuotes.jsx';
import {
  EditQuoteForm,
  QuoteDetailsAddLineItemModal,
  QuoteDetailsHeader,
  QuoteDetailsMain,
  QuoteDetailsPane,
  QuoteDetailsPdfPreviewModal,
  QuoteDetailsQuickAction
} from '../../components/index.js';
import {
  Flex,
  useDisclosure,
  Container,
  useToast,
  useColorModeValue,
  Text,
  Spinner
} from '@chakra-ui/react';
import {
  useCreateQuoteLineItem,
  useDeleteQuoteLineItemById
} from '../../hooks/useQuoteLineItem.jsx';

const QuoteById = () => {
  const { id } = useParams();
  const toast = useToast();

  // Custom Hooks
  const { quoteById, isLoading: isQuoteByIdLoading } = useFetchQuoteById(id);
  const { services } = useServices();
  const { quoteStatuses } = useQuoteStatuses();
  const { mutate: mutateUpdateQuoteStatusById, isLoading: isUpdateQuoteStatusByIdLoading } =
    useUpdateQuoteStatusById(toast, id);
  const { mutate: mutateCreateQuoteLineItem, isLoading: isCreateQuoteLineItemLoading } =
    useCreateQuoteLineItem(toast, id);
  const { mutate: mutateDeleteQuoteLineItemById, isLoading: isDeleteQuoteLineItemByIdLoading } =
    useDeleteQuoteLineItemById(toast, id);

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
  const secondaryTextColor = useColorModeValue('gray.600', 'gray.300');

  // Handle quote status when selected in menu
  const handleQuoteStatusMenuSelection = async (status_id) => {
    setLoadingQuoteStatusIsOn(true);
    if (status_id === quoteById?.status_id) {
      console.log(status_id);
      toast({
        position: 'top',
        title: `Error Updating Quote Status`,
        description: `Error: Status is already selected. Please select another status for quote.`,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } else {
      mutateUpdateQuoteStatusById(status_id);
    }
    setLoadingQuoteStatusIsOn(false);
  };

  //////////////////////// Functions to handle line items //////////////////////////////
  const handleLineItemDelete = async (item) => {
    mutateDeleteQuoteLineItemById(item);
  };

  const handleAddLineItemSubmit = async (e) => {
    e.preventDefault();
    mutateCreateQuoteLineItem(lineItemObject);
    onAddLineItemClose();
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

  const lineItemObject = {
    quote_id: quoteById?.quote_number,
    service_id: quoteById?.service_id,
    qty: 1,
    amount: lineItemAmountInput,
    description: lineItemDescriptionInput,
    fixed_item: true
  };

  // Convert Quote to Invoice

  // Handle adding new line item to quote
  const handlePDFDownload = () => {
    onExportPDFClose();
  };

  if (isQuoteByIdLoading === true) {
    return (
      <>
        <Container maxW={'1400px'} mt={'1rem'} mb={'2rem'}>
          <Flex gap={2} justify={'center'}>
            <Spinner size={'sm'} my={'auto'} />
            <Text fontSize={'xl'} fontWeight={'bold'}>
              Loading...
            </Text>
          </Flex>
        </Container>
      </>
    );
  }

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
            loadingQuoteStatusIsOn={isUpdateQuoteStatusByIdLoading}
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
        loadingQuoteStatusIsOn={isUpdateQuoteStatusByIdLoading}
      />
    </Container>
  );
};

export default QuoteById;
