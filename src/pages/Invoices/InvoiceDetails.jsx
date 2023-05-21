import React, { useState } from 'react';
import { Flex, useDisclosure, Container, useColorModeValue, useToast } from '@chakra-ui/react';
// import {Link, Redirect, useHistory} from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { usePDF } from '@react-pdf/renderer';
import supabase from '../../utils/supabaseClient';
import formatMoneyValue from '../../utils/formatMoneyValue';
import formatDate from '../../utils/formatDate';
import {
  EditInvoiceForm,
  InvoiceDetailsAddLineItemModal,
  InvoiceDetailsAddPaymenyModal,
  InvoiceDetailsMain,
  InvoiceDetailsPane,
  InvoiceDetailsPreviewPDFModal,
  InvoiceDetailsQuickActionCard,
  InvoiceDocument
} from '../../components';
import DeleteInvoiceLineServiceAlertDialog from '../../components/ui/Alerts/DeleteInvoiceLineServiceAlertDialog';
import { useFetchAllInvoiceStatuses } from '../../hooks/useAPI/useInvoiceStatuses';
import InvoiceDetailsHeader from '../../components/Invoices/InvoiceDetails/InvoiceDetailsHeader';
import { useFetchInvoiceById, useUpdateInvoiceStatusById } from '../../hooks/useAPI/useInvoices';
import { useFetchAllServices } from '../../hooks/useAPI/useServices';
import { useQueryClient } from '@tanstack/react-query';
import { useCreateInvoiceLineItem } from '../../hooks/useAPI/useInvoiceLineItem';

const InvoiceDetails = () => {
  const { id } = useParams();
  const toast = useToast();
  const {
    data: invoice,
    isLoading: isInvoiceLoading,
    isError: isInvoiceError
  } = useFetchInvoiceById(id);

  // Modal useDisclose Hooks
  const {
    isOpen: isAddPaymentOpen,
    onOpen: onAddPaymentOpen,
    onClose: onAddPaymentClose
  } = useDisclosure();
  const {
    isOpen: isAddLineItemOpen,
    onOpen: onAddLineItemOpen,
    onClose: onAddLineItemClose
  } = useDisclosure();
  const {
    isOpen: isEditInvoiceOpen,
    onOpen: onEditInvoiceOpen,
    onClose: onEditInvoiceClose
  } = useDisclosure();
  const {
    isOpen: isExportPDFOpen,
    onOpen: onExportPDFOpen,
    onClose: onExportPDFClose
  } = useDisclosure();

  // Custom React Hooks
  const {
    data: services,
    isLoading: isRoofingServicesLoading,
    isError: isRoofingServicesError
  } = useFetchAllServices();
  const {
    data: invoiceStatuses,
    isError: isInvoiceStatusesError,
    isLoading: isInvoiceStatusesLoading
  } = useFetchAllInvoiceStatuses();
  const [instance, updateInstance] = usePDF({ document: InvoiceDocument });
  const {
    mutate: mutateUpdateInvoiceStatusById,
    isLoading: isUpdateInvoiceStatusByIdLoading,
    isError: isUpdateInvoiceStatusByIdError
  } = useUpdateInvoiceStatusById(toast);
  const {
    mutate: mutateCreateInvoiceLineItem,
    isLoading: isCreateInvoiceLineItemLoading,
    isError: isCreateInvoiceLineItemError
  } = useCreateInvoiceLineItem(toast);

  // Custom color configs for UX elements
  const bgColorMode = useColorModeValue('gray.100', 'gray.600');
  const bg = useColorModeValue('white', 'gray.800');
  const paymentCardBgColor = useColorModeValue('gray.100', 'gray.600');
  const paymentBorderColor = useColorModeValue('gray.200', 'gray.400');
  const secondaryTextColor = useColorModeValue('gray.600', 'gray.300');

  // React Array Object States
  // const [invoice, setInvoice] = useState();
  const [selectedEditInvoice, setSelectedEditInvoice] = useState({
    id: '',
    invoice_number: '',
    service_type_id: '',
    invoice_status_id: '',
    invoice_date: '',
    issue_date: '',
    due_date: '',
    sqft_measurement: '',
    note: '',
    cust_note: ''
  });

  // React state toggles
  const [editSwitchIsOn, setEditSwitchIsOn] = useState(false);
  const [loadingInvoiceStatusIsOn, setLoadingInvoiceStatusIsOn] = useState(false);
  const [loadingState, setLoadingState] = useState(false);
  const [invoiceLoadingState, setInvoiceLoadingState] = useState(false);
  const [invoiceLineItemLoadingState, setInvoiceLineItemLoadingState] = useState(false);

  // React Input States
  const [invoiceServiceInputField, setInvoiceServiceInputField] = useState('');
  const [invoiceDateInputField, setInvoiceDateInputField] = useState('');

  // React Add Payment Inputs States
  const [dateReceivedPaymentInput, setDateReceivedPaymnetInput] = useState('');
  const [paymentMethodPaymentInput, setPaymentMethodPaymentInput] = useState('');
  const [amountPaymentInput, setAmountPaymentInput] = useState('');

  // React Add Line Item Input States
  const [descriptionLineItemInput, setDescriptionLineItemInput] = useState('');
  const [amountLineItemInput, setAmountLineItemInput] = useState('');

  // Handle selection from menu item for invoice status
  const handleInvoiceStatusMenuSelection = async (status_id) => {
    const updateInvoiceStatusObject = {
      status_id: status_id,
      invoice_number: id
    };
    if (status_id === invoice?.invoice_status.id) {
      toast({
        position: 'top',
        title: `Error Updating Invoice Status`,
        description: `Error: Status is already selected. Please select another status for quote.`,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } else {
      mutateUpdateInvoiceStatusById(updateInvoiceStatusObject);
    }
  };

  // Handle success message toast when invoice has been deleted
  const handleDeleteToast = (invoice_number) => {
    toast({
      position: 'top',
      title: `Invoice #${invoice_number} deleted! 🚀`,
      description: "We've deleted invoice for you.",
      status: 'success',
      duration: 5000,
      isClosable: true
    });
  };

  //////////////////////////// Functions that handle payments functionality /////////////////////////////////////////
  const handleAddPaymentSubmit = async (e) => {
    setLoadingState(true);
    e.preventDefault();

    const { data, error } = await supabase.from('invoice_payment').insert({
      invoice_id: invoice.invoice_number,
      date_received: dateReceivedPaymentInput,
      payment_method: paymentMethodPaymentInput,
      amount: amountPaymentInput
    });

    if (error) {
      toast({
        position: 'top',
        title: `Error Occured Adding Payment`,
        description: `Error: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }

    if (data) {
      // await getInvoiceDetailsById();
      toast({
        position: 'top',
        title: `Succesfully Added Payment`,
        description: `We were able to add a payment for invoice number ${invoice.invoice_number} 🎉`,
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    }

    // Set values empty
    setDateReceivedPaymnetInput('');
    setPaymentMethodPaymentInput('');
    setAmountPaymentInput('');

    setLoadingState(false);
    onAddPaymentClose();
  };

  const handlePaymentDelete = async (item_id, date_received, amount) => {
    setLoadingState(true);
    console.log(item_id);
    const { data, error } = await supabase.from('invoice_payment').delete().eq('id', item_id);

    if (error) {
      console.log(error);
      toast({
        position: 'top',
        title: `Error Occured Deleting Payment`,
        description: `Error: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
    if (data) {
      // await getInvoiceDetailsById();
      console.log(data);
      toast({
        position: 'top',
        title: `Succesfully Deleted Payment`,
        description: `We were able to delete a payment that was posted for ${formatDate(
          date_received
        )} for a total of $${formatMoneyValue(amount)} 🎉`,
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    }
    setLoadingState(false);
  };

  //////////////////////////// Functions that handle line-item functionality /////////////////////////////////////////
  const handleLineItemDelete = async (item_id, description, amount) => {
    setLoadingState(false);
    const { data, error } = await supabase.from('invoice_line_service').delete().eq('id', item_id);

    if (error) {
      console.log(error);
      toast({
        position: 'top',
        title: `Error Occured Deleting Line Item`,
        description: `Error: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }

    if (data) {
      // await getInvoiceDetailsById();
      toast({
        position: 'top',
        title: `Succesfully Deleted Invoice Line Item`,
        description: `We were able to delete a line item with description of "${description}" with an amount of "${formatMoneyValue(
          amount
        )}" successfully 🎉`,
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    }
    setLoadingState(false);
  };

  const handleAddLineItemSubmit = async (e) => {
    // setInvoiceLineItemLoadingState(true);
    e.preventDefault();
    const newInvoiceLineItemObject = {
      invoice_id: invoice.invoice_number,
      service_id: invoice.service_type_id,
      qty: '1',
      fixed_item: 'true',
      description: descriptionLineItemInput,
      amount: amountLineItemInput
    };

    // const { data, error } = await supabase
    //   .from('invoice_line_service')
    //   .insert(newInvoiceLineItemObject);

    // if (error) {
    //   toast({
    //     position: 'top',
    //     title: `Error Occured Creating Line Item`,
    //     description: `Error: ${error.message}`,
    //     status: 'error',
    //     duration: 5000,
    //     isClosable: true
    //   });
    // }
    // if (data) {
    //   // await getInvoiceDetailsById();
    //   setInvoiceLineItemLoadingState(false);
    //   onAddLineItemClose();
    //   toast({
    //     position: 'top',
    //     title: `Succesfully Added Line Item`,
    //     description: `We were able to add a line-item for invoice number ${invoice.invoice_number} 🎉`,
    //     status: 'success',
    //     duration: 5000,
    //     isClosable: true
    //   });
    // }
    mutateCreateInvoiceLineItem(newInvoiceLineItemObject);
    onAddLineItemClose();
  };

  //////////////////////////// Functions that handle invoice edit functionality /////////////////////////////////////////
  const handleEditInvoiceOnChange = (e) => {
    setSelectedEditInvoice({ ...selectedEditInvoice, [e.target.name]: e.target.value });
  };

  const handleEditInvoiceModal = (invoice) => {
    setSelectedEditInvoice({
      id: invoice.id,
      invoice_number: invoice.invoice_number,
      service_type_id: invoice.service_type_id,
      invoice_status_id: invoice.invoice_status_id,
      invoice_date: invoice.invoice_date,
      issue_date: invoice.issue_date,
      due_date: invoice.due_date,
      sqft_measurement: invoice.sqft_measurement,
      note: invoice.note,
      cust_note: invoice.cust_note
    });
    onEditInvoiceOpen();
  };

  const handleEditInvoiceSubmit = async (e) => {
    e.preventDefault();
    setInvoiceLoadingState(true);
    const { data, error } = await supabase
      .from('invoice')
      .update({
        service_type_id: selectedEditInvoice.service_type_id,
        invoice_status_id: selectedEditInvoice.invoice_status_id,
        invoice_date: selectedEditInvoice.invoice_date,
        issue_date: selectedEditInvoice.issue_date,
        due_date: selectedEditInvoice.due_date,
        sqft_measurement: selectedEditInvoice.sqft_measurement,
        note: selectedEditInvoice.note,
        cust_note: selectedEditInvoice.cust_note,
        updated_at: new Date()
      })
      .eq('invoice_number', selectedEditInvoice.invoice_number);

    if (error) {
      toast({
        position: 'top',
        title: `Error Updating Invoice Number ${selectedEditInvoice.invoice_number}`,
        description: `Error: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }

    if (data) {
      // await getInvoiceDetailsById();
      setInvoiceLoadingState(false);
      onEditInvoiceClose();
      toast({
        position: 'top',
        title: `Successfully Updated Invoice!`,
        description: `We've updated INV# ${selectedEditInvoice.invoice_number} for you 🎉`,
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    }
    setSelectedEditInvoice({
      id: '',
      invoice_number: '',
      service_type_id: '',
      invoice_status_id: '',
      invoice_date: '',
      issue_date: '',
      due_date: '',
      sqft_measurement: '',
      note: '',
      cust_note: ''
    });
  };

  // Handle custom editable controls for line items

  // Upcoming functions & changes
  // Function to handle the updating of invoice status but might be done using forms
  // Modal to delete invoice just like in the invoices page
  // Drawer to update invoices such as the invoices page

  const handleDownloadPDFButton = () => {
    onExportPDFClose();
  };

  return (
    <Container maxW={'1440px'} pt={'1rem'} pb={'2rem'}>
      {/* Page Header */}
      <InvoiceDetailsHeader
        handleEditInvoiceModal={handleEditInvoiceModal}
        invoice={invoice}
        onExportPDFOpen={onExportPDFOpen}
      />
      <Flex px={'1rem'} gap={4} flexDir={{ base: 'column', lg: 'row' }}>
        {/* Left Section */}
        <InvoiceDetailsMain
          invoice={invoice}
          paymentCardBgColor={paymentCardBgColor}
          editSwitchIsOn={editSwitchIsOn}
          handleLineItemDelete={handleLineItemDelete}
          bgColorMode={bgColorMode}
          secondaryTextColor={secondaryTextColor}
        />
        {/* Right Section */}
        <Flex w={{ base: 'full', lg: '40%' }} direction={'column'} gap={3}>
          <InvoiceDetailsQuickActionCard
            invoice={invoice}
            handleInvoiceStatusMenuSelection={handleInvoiceStatusMenuSelection}
            loadingInvoiceStatusIsOn={isUpdateInvoiceStatusByIdLoading}
            onAddLineItemOpen={onAddLineItemOpen}
            onAddPaymentOpen={onAddPaymentOpen}
            setEditSwitchIsOn={setEditSwitchIsOn}
            editSwitchIsOn={editSwitchIsOn}
          />
          <InvoiceDetailsPane
            invoice={invoice}
            secondaryTextColor={secondaryTextColor}
            paymentCardBgColor={paymentCardBgColor}
            handlePaymentDelete={handlePaymentDelete}
            loadingState={loadingState}
            editSwitchIsOn
          />
        </Flex>
      </Flex>
      {/* Alert to delete line service */}
      <DeleteInvoiceLineServiceAlertDialog
        toast={handleDeleteToast}
        // updateParentState={getInvoiceDetailsById}
      />
      {/* Modal form to edit invoice */}
      <EditInvoiceForm
        onClose={onEditInvoiceClose}
        isOpen={isEditInvoiceOpen}
        invoice={selectedEditInvoice}
        handleEditOnChange={handleEditInvoiceOnChange}
        handleEditSubmit={handleEditInvoiceSubmit}
        services={services}
        invoiceStatuses={invoiceStatuses}
        loadingState={isInvoiceLoading}
      />
      {/* Modal to add payments to invoice */}
      <InvoiceDetailsAddPaymenyModal
        onAddPaymentClose={onAddPaymentClose}
        isAddPaymentOpen={isAddPaymentOpen}
        handleAddPaymentSubmit={handleAddPaymentSubmit}
        dateReceivedPaymentInput={dateReceivedPaymentInput}
        setDateReceivedPaymnetInput={setDateReceivedPaymnetInput}
        paymentMethodPaymentInput={paymentMethodPaymentInput}
        setPaymentMethodPaymentInput={setPaymentMethodPaymentInput}
        amountPaymentInput={amountPaymentInput}
        setAmountPaymentInput={setAmountLineItemInput}
        loadingState={loadingState}
      />
      {/* Modal to add line item to invoice */}
      <InvoiceDetailsAddLineItemModal
        onAddLineItemClose={onAddLineItemClose}
        isAddLineItemOpen={isAddLineItemOpen}
        handleAddLineItemSubmit={handleAddLineItemSubmit}
        setDescriptionLineItemInput={setDescriptionLineItemInput}
        setAmountLineItemInput={setAmountLineItemInput}
        invoiceLineItemLoadingState={invoiceLineItemLoadingState}
      />
      {/* Modal for Previewing PDF */}
      <InvoiceDetailsPreviewPDFModal
        invoice={invoice}
        onExportPDFClose={onExportPDFClose}
        isExportPDFOpen={isExportPDFOpen}
        handleDownloadPDFButton={handleDownloadPDFButton}
      />
    </Container>
  );
};

export default InvoiceDetails;
