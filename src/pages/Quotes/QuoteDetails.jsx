import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Flex,
  useDisclosure,
  Container,
  useToast,
  useColorModeValue,
  Text,
  Spinner,
  Skeleton
} from '@chakra-ui/react';
import {
  ConnectedConvertQuoteToInvoice,
  EditQuoteForm,
  QuoteDetailsAddLineItemModal,
  QuoteDetailsHeader,
  QuoteDetailsMain,
  QuoteDetailsPane,
  QuoteDetailsPdfPreviewModal,
  QuoteDetailsQuickAction
} from '../../components/index.js';
import {
  useFetchQuoteById,
  useUpdateQuote,
  useUpdateQuoteStatusById
} from '../../hooks/useAPI/useQuotes.jsx';
import {
  useCreateQuoteLineItem,
  useDeleteQuoteLineItemById
} from '../../hooks/useAPI/useQuoteLineItem.jsx';
import { useFetchAllServices } from '../../hooks/useAPI/useServices.jsx';
import { useQuoteStatuses } from '../../hooks/useAPI/useQuoteStatuses.jsx';

const QuoteById = () => {
  const { id } = useParams();
  const toast = useToast();
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  // Custom Hooks
  const { quoteById, isLoading: isQuoteByIdLoading } = useFetchQuoteById(id);
  const {
    data: services,
    isRoofingServicesLoading,
    isRoofingServicesError
  } = useFetchAllServices();
  const { quoteStatuses } = useQuoteStatuses();
  const { mutate: mutateUpdateQuoteStatusById, isLoading: isUpdateQuoteStatusByIdLoading } =
    useUpdateQuoteStatusById(toast, id);
  const { mutate: mutateCreateQuoteLineItem, isLoading: isCreateQuoteLineItemLoading } =
    useCreateQuoteLineItem(toast, id);
  const { mutate: mutateDeleteQuoteLineItemById, isLoading: isDeleteQuoteLineItemByIdLoading } =
    useDeleteQuoteLineItemById(toast, id);
  const { mutate: mutateUpdateQuote, isLoading: isUpdateQuoteLoading } = useUpdateQuote(toast);

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
  const {
    isOpen: isConvertToInvoiceOpen,
    onOpen: onConvertToInvoiceOpen,
    onClose: onConvertToInvoiceClose
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
  const [editSwitchIsOn, setEditSwitchIsOn] = useState(false);

  // React state input variables
  const [lineItemDescriptionInput, setLineItemDescriptionInput] = useState('');
  const [lineItemAmountInput, setLineItemAmountInput] = useState('');

  // Custom color configs for UX elements
  const bgColorMode = useColorModeValue('gray.100', 'gray.600');
  const paymentCardBgColor = useColorModeValue('gray.100', 'gray.600');
  const secondaryTextColor = useColorModeValue('gray.600', 'gray.300');

  // Handle quote status when selected in menu
  const handleQuoteStatusMenuSelection = async (status_id) => {
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
    mutateUpdateQuote(selectedEditQuote);
    onEditQuoteClose();
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

  return (
    <Container maxW={'1400px'} mt={'1rem'} mb={'2rem'}>
      {/* <DeleteInvoiceLineServiceAlertDialog toast={handleDeleteToast} updateParentState={getInvoiceDetailsById} /> */}
      <QuoteDetailsHeader
        quoteById={quoteById}
        onExportPDFOpen={onExportPDFOpen}
        handleEditQuoteModal={handleEditQuoteModal}
        openConvertAlert={onConvertToInvoiceOpen}
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
      <ConnectedConvertQuoteToInvoice
        isOpen={isConvertToInvoiceOpen}
        intialRef={initialRef}
        finalRef={finalRef}
        onClose={onConvertToInvoiceClose}
        onOpen={onConvertToInvoiceOpen}
        toast={toast}
        itemNumber={id}
        header={`Convert Quote to Invoice`}
      />
    </Container>
  );
};

export default QuoteById;
