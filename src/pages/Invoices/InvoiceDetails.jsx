import React, { useEffect, useState, Fragment } from 'react';
import {
  Badge,
  Textarea,
  Box,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  useDisclosure,
  Container,
  Card,
  CardBody,
  Avatar,
  Skeleton,
  useColorModeValue,
  IconButton,
  useToast
} from '@chakra-ui/react';
// import {Link, Redirect, useHistory} from 'react-router-dom';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PDFViewer, usePDF, PDFDownloadLink } from '@react-pdf/renderer';
import {
  FiBriefcase,
  FiCalendar,
  FiUser,
  FiSend,
  FiAlignLeft,
  FiX,
  FiFileText
} from 'react-icons/fi';
import { MdPayment } from 'react-icons/md';
import { BiNote, BiRuler } from 'react-icons/bi';
import { HiStatusOnline } from 'react-icons/hi';
import supabase from '../../utils/supabaseClient';
import formatMoneyValue from '../../utils/formatMoneyValue';
import formatDate from '../../utils/formatDate';
import {
  EditInvoiceForm,
  InvoiceDetailsMain,
  InvoiceDetailsQuickActionCard,
  InvoiceDocument
} from '../../components';
import DeleteInvoiceLineServiceAlertDialog from '../../components/ui/Alerts/DeleteInvoiceLineServiceAlertDialog';
import { useServices } from '../../hooks/useServices';
import { useInvoiceStatuses } from '../../hooks/useInvoiceStatuses';
import InvoiceDetailsHeader from '../../components/Invoices/InvoiceDetails/InvoiceDetailsHeader';

const InvoiceDetails = () => {
  // Chakra UI hooks
  const toast = useToast();
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
  const { services } = useServices();
  const { invoiceStatuses } = useInvoiceStatuses();
  const [instance, updateInstance] = usePDF({ document: InvoiceDocument });

  // Custom color configs for UX elements
  const bgColorMode = useColorModeValue('gray.100', 'gray.600');
  const bg = useColorModeValue('white', 'gray.800');
  const paymentCardBgColor = useColorModeValue('gray.100', 'gray.600');
  const paymentBorderColor = useColorModeValue('gray.200', 'gray.400');
  const secondaryTextColor = useColorModeValue('gray.600', 'gray.300');

  // React Array Object States
  const [invoice, setInvoice] = useState();
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

  // Define variables
  const { id } = useParams();
  let navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef();

  //React functions to load when component is rendering
  useEffect(() => {
    getInvoiceDetailsById();
  }, []);

  // Function that call the supabase DB to get invoice info
  const getInvoiceDetailsById = async () => {
    const { data, error } = await supabase
      .from('invoice')
      .select(
        '*, customer:customer_id(*), invoice_status:invoice_status_id(*), service_type:service_type_id(*), invoice_line_service(*), invoice_payment(*)'
      )
      .eq('invoice_number', `${id}`);

    if (error) {
      console.log(error);
    }
    setInvoice(data[0]);
    console.log(data[0]);
  };

  // Handle selection from menu item for invoice status
  const handleInvoiceStatusMenuSelection = async (status_id) => {
    setLoadingInvoiceStatusIsOn(true);
    // console.log(status_id)
    if (status_id === invoice?.invoice_status.id) {
      // Create toast feedback to let user know that they
      console.log(status_id);
    } else {
      const { error } = await supabase
        .from('invoice')
        .update({ invoice_status_id: status_id })
        .eq('invoice_number', invoice.invoice_number);

      if (error) {
        console.log(error);
      }
      await getInvoiceDetailsById();
    }
    setLoadingInvoiceStatusIsOn(false);
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
      await getInvoiceDetailsById();
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
      await getInvoiceDetailsById();
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
      await getInvoiceDetailsById();
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
    setInvoiceLineItemLoadingState(true);
    e.preventDefault();

    const { data, error } = await supabase.from('invoice_line_service').insert({
      invoice_id: invoice.invoice_number,
      service_id: invoice.service_type_id,
      qty: '1',
      fixed_item: 'true',
      description: descriptionLineItemInput,
      amount: amountLineItemInput
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
      await getInvoiceDetailsById();
      setInvoiceLineItemLoadingState(false);
      onAddLineItemClose();
      toast({
        position: 'top',
        title: `Succesfully Added Line Item`,
        description: `We were able to add a line-item for invoice number ${invoice.invoice_number} 🎉`,
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    }
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
      await getInvoiceDetailsById();
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
      <DeleteInvoiceLineServiceAlertDialog
        toast={handleDeleteToast}
        updateParentState={getInvoiceDetailsById}
      />
      <EditInvoiceForm
        onClose={onEditInvoiceClose}
        isOpen={isEditInvoiceOpen}
        invoice={selectedEditInvoice}
        handleEditOnChange={handleEditInvoiceOnChange}
        handleEditSubmit={handleEditInvoiceSubmit}
        services={services}
        invoiceStatuses={invoiceStatuses}
        loadingState={invoiceLoadingState}
      />
      {/* Page Header */}
      <InvoiceDetailsHeader handleEditInvoiceModal={handleEditInvoiceModal} invoice={invoice} />
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
            loadingInvoiceStatusIsOn={loadingInvoiceStatusIsOn}
            onAddLineItemOpen={onAddLineItemOpen}
            onAddPaymentOpen={onAddPaymentOpen}
            setEditSwitchIsOn={setEditSwitchIsOn}
            editSwitchIsOn={editSwitchIsOn}
          />
          <Card w={'full'} rounded={'xl'} size="lg">
            <CardBody overflowY={'auto'}>
              {/* Invoice Extra Details */}
              <Box>
                <Flex alignItems={'center'} gap={3} mb={'1rem'}>
                  <FiAlignLeft size={'20px'} color="gray" />
                  <Text fontSize={'xl'} fontWeight={'semibold'} color={secondaryTextColor}>
                    Details
                  </Text>
                </Flex>
                <Flex mb={'1rem'} gap="2">
                  <Box my="auto">
                    <HiStatusOnline />
                  </Box>
                  <Text
                    w={'40%'}
                    fontWeight={'semibold'}
                    textColor={secondaryTextColor}
                    my={'auto'}>
                    Status
                  </Text>
                  {!invoice ? (
                    <Skeleton bg={paymentCardBgColor} height={'20px'} rounded={'xl'} w={'full'} />
                  ) : (
                    <Badge
                      colorScheme={
                        invoice?.invoice_status.name === 'Paid'
                          ? 'green'
                          : invoice?.invoice_status.name === 'Pending'
                          ? 'yellow'
                          : invoice?.invoice_status.name === 'Overdue'
                          ? 'red'
                          : invoice?.invoice_status.name === 'Draft'
                          ? 'gray'
                          : 'facebook'
                      }
                      variant={'subtle'}
                      mr={'1rem'}
                      pt={'2px'}
                      w={'80px'}
                      rounded={'xl'}
                      textAlign={'center'}>
                      {invoice?.invoice_status.name}
                    </Badge>
                  )}
                </Flex>
                <Flex mb={'1rem'} gap="2">
                  <Box my="auto">
                    <FiBriefcase />
                  </Box>
                  <Text w={'40%'} fontWeight={'semibold'} textColor={secondaryTextColor} my="auto">
                    Service
                  </Text>
                  {!invoice ? (
                    <Skeleton bg={paymentCardBgColor} height={'20px'} rounded={'xl'} w={'full'} />
                  ) : (
                    <Text mr={'1rem'}>{invoice?.service_type.name}</Text>
                  )}
                </Flex>
                <Flex mb={'1rem'} gap="2">
                  <Box my="auto">
                    <FiCalendar />
                  </Box>
                  <Text w={'40%'} fontWeight={'semibold'} textColor={secondaryTextColor}>
                    Invoice Date
                  </Text>
                  {!invoice ? (
                    <Skeleton bg={paymentCardBgColor} height={'20px'} rounded={'xl'} w={'full'} />
                  ) : (
                    <>
                      <Text mr={'1rem'}>{formatDate(invoice?.invoice_date)}</Text>
                    </>
                  )}
                </Flex>
                <Flex mb={'1rem'} gap="2">
                  <Box my="auto">
                    <FiSend />
                  </Box>
                  <Text w={'40%'} fontWeight={'semibold'} textColor={secondaryTextColor}>
                    Issue Date
                  </Text>
                  {!invoice ? (
                    <Skeleton bg={paymentCardBgColor} height={'20px'} rounded={'xl'} w={'full'} />
                  ) : (
                    <>
                      <Text mr={'1rem'}>
                        {!invoice?.issue_date
                          ? 'Not Issued yet... 🙅‍♂️'
                          : formatDate(invoice?.issue_date)}
                      </Text>
                    </>
                  )}
                </Flex>
                <Flex mb={'1rem'} gap="2">
                  <Box my="auto">
                    <FiUser />
                  </Box>
                  <Text
                    w={'36%'}
                    fontWeight={'semibold'}
                    textColor={secondaryTextColor}
                    my={'auto'}>
                    Customer
                  </Text>
                  {!invoice ? (
                    <Skeleton bg={paymentCardBgColor} height={'20px'} rounded={'xl'} w={'full'} />
                  ) : (
                    <>
                      <Flex>
                        <Link to={`/invoices/${invoice?.customer.id}`}>
                          <Button variant={'ghost'}>
                            <Avatar size={'xs'} />
                            <Text my={'auto'} ml={'8px'} fontWeight={'medium'}>
                              {invoice?.customer.first_name} {invoice?.customer.last_name}
                            </Text>
                          </Button>
                        </Link>
                      </Flex>
                    </>
                  )}
                </Flex>
                <Box w="full">
                  <Flex my={'1rem'} gap={2}>
                    <Box my="auto">
                      <MdPayment />
                    </Box>
                    <Text fontWeight={'semibold'} textColor={secondaryTextColor}>
                      Payments
                    </Text>
                  </Flex>
                  <Flex w="full" px={6} mb={6} gap="4">
                    <Flex direction="column" gap="2" w="full">
                      {invoice?.invoice_payment?.map((item, index) => (
                        <>
                          <Flex
                            key={index}
                            gap="6"
                            bg={useColorModeValue('gray.100', 'gray.600')}
                            py="2"
                            px="6"
                            rounded="xl"
                            w="full">
                            <Box w="5%" my="auto">
                              <Box h="10px" w="10px" bg="green.300" rounded="full"></Box>
                            </Box>
                            <Flex gap="6">
                              <Text
                                w="60%"
                                fontWeight={'semibold'}
                                my="auto"
                                textColor={secondaryTextColor}>
                                {formatDate(item.date_received)}
                              </Text>
                              <Text w="full" my="auto" textAlign="center">
                                {item.payment_method}
                              </Text>
                            </Flex>
                            <Box ml="auto" my="auto">
                              <Text ml="2rem">${formatMoneyValue(item.amount)}</Text>
                            </Box>
                            {editSwitchIsOn === true ? (
                              <>
                                <Box>
                                  <IconButton
                                    onClick={() =>
                                      handlePaymentDelete(item.id, item.date_received, item.amount)
                                    }
                                    icon={<FiX size="15px" />}
                                    isLoading={loadingState}
                                  />
                                </Box>
                              </>
                            ) : (
                              <></>
                            )}
                          </Flex>
                        </>
                      ))}
                    </Flex>
                  </Flex>
                </Box>
                <Box w="full" mb="2rem">
                  <Flex mb={'1rem'} gap={2}>
                    <Box my="auto">
                      <BiNote />
                    </Box>
                    <Text fontWeight={'semibold'} textColor={secondaryTextColor}>
                      Note
                    </Text>
                  </Flex>
                  {!invoice ? (
                    <Skeleton bg={paymentCardBgColor} height={'20px'} rounded={'xl'} />
                  ) : (
                    <>
                      <Box px={6}>
                        <Box bg={paymentCardBgColor} p="2" rounded="xl">
                          <Textarea
                            border="none"
                            isReadOnly
                            value={
                              !invoice?.note ? 'No note for this invoice... 🙅‍♂️' : invoice?.note
                            }
                          />
                          {/* {!invoice?.note ? '❌ No note for this invoice...' : <Text>{invoice.note}</Text>} */}
                        </Box>
                      </Box>
                    </>
                  )}
                </Box>
                <Box w="full">
                  <Flex mb={'1rem'} gap={2}>
                    <Box my="auto">
                      <BiRuler />
                    </Box>
                    <Text fontWeight={'semibold'} textColor={secondaryTextColor}>
                      Measurements
                    </Text>
                  </Flex>
                  {!invoice ? (
                    <Skeleton bg={paymentCardBgColor} height={'20px'} rounded={'xl'} />
                  ) : (
                    <>
                      <Box px="6">
                        <Box bg={paymentCardBgColor} p="2" rounded="xl">
                          <Textarea border="none" isReadOnly>
                            {!invoice?.sqft_measurement
                              ? 'No measurement information... 🙅‍♂️'
                              : invoice?.sqft_measurement}
                          </Textarea>
                        </Box>
                      </Box>
                    </>
                  )}
                </Box>
              </Box>
            </CardBody>
          </Card>
        </Flex>
      </Flex>
      {/* Modal to add payments to invoice */}
      <Modal
        onClose={onAddPaymentClose}
        isOpen={isAddPaymentOpen}
        size={'xl'}
        isCentered
        motionPreset="scale">
        <ModalOverlay />
        <form method="POST" onSubmit={handleAddPaymentSubmit}>
          <ModalContent>
            <ModalHeader shadow={'xs'}>
              <Flex gap={2}>
                <Box my={'auto'}>
                  <MdPayment size={'24px'} />
                </Box>
                <Text>Add Payment</Text>
              </Flex>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Flex gap={4} my={'2rem'}>
                <Box>
                  <FormControl isRequired>
                    <FormLabel>Date Received</FormLabel>
                    <Input
                      name={'date_received'}
                      type={'date'}
                      value={dateReceivedPaymentInput}
                      onChange={(e) => setDateReceivedPaymnetInput(e.target.value)}
                    />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl isRequired>
                    <FormLabel>Payment Method</FormLabel>
                    <Input
                      name={'payment_method'}
                      value={paymentMethodPaymentInput}
                      onChange={(e) => setPaymentMethodPaymentInput(e.target.value)}
                    />
                  </FormControl>
                </Box>
                <Box w={'20%'}>
                  <FormControl isRequired>
                    <FormLabel>Amount</FormLabel>
                    <Input
                      name={'amount'}
                      type={'number'}
                      value={amountPaymentInput}
                      onChange={(e) => setAmountPaymentInput(e.target.value)}
                    />
                  </FormControl>
                </Box>
              </Flex>
            </ModalBody>
            <ModalFooter gap={4}>
              <Button colorScheme={'blue'} type={'submit'} isLoading={loadingState}>
                Add Payment
              </Button>
              <Button onClick={onAddPaymentClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
      {/* Modal to add line item to invoice */}
      <Modal
        onClose={onAddLineItemClose}
        isOpen={isAddLineItemOpen}
        size="xl"
        isCentered
        motionPreset="scale">
        <ModalOverlay />
        <form method="POST" onSubmit={handleAddLineItemSubmit}>
          <ModalContent>
            <ModalHeader>Add Line Item</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Flex gap="4">
                <Box w="60%">
                  <FormControl isRequired>
                    <FormLabel>Description</FormLabel>
                    <Input onChange={(e) => setDescriptionLineItemInput(e.target.value)} />
                  </FormControl>
                </Box>
                <Box w="15%">
                  <FormControl isRequired>
                    <FormLabel>Qty</FormLabel>
                    <Input value="1" disabled />
                  </FormControl>
                </Box>
                <Box w="20%">
                  <FormControl isRequired>
                    <FormLabel>Rate</FormLabel>
                    <Input value="Fixed" disabled />
                  </FormControl>
                </Box>
                <Box w="25%">
                  <FormControl isRequired>
                    <FormLabel>Amount</FormLabel>
                    <Input onChange={(e) => setAmountLineItemInput(e.target.value)} />
                  </FormControl>
                </Box>
              </Flex>
            </ModalBody>
            <ModalFooter>
              <Flex gap="4">
                <Button colorScheme="blue" type="submit" isLoading={invoiceLineItemLoadingState}>
                  Add Line Item
                </Button>
                <Button onClick={onAddLineItemClose}>Cancel</Button>
              </Flex>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
      {/* Modal for Previewing PDF */}
      <Modal
        onClose={onExportPDFClose}
        isOpen={isExportPDFOpen}
        size={'xl'}
        isCentered
        motionPreset="scale">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex gap="2">
              <Box my="auto">
                <FiFileText />
              </Box>
              <Text>Invoice Preview</Text>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex>
              <Fragment>
                <PDFViewer width="1000" height="800">
                  <InvoiceDocument invoice={invoice} />
                </PDFViewer>
              </Fragment>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Flex gap="4">
              <Button colorScheme="blue" onClick={() => handleDownloadPDFButton()}>
                <PDFDownloadLink
                  document={<InvoiceDocument invoice={invoice} />}
                  fileName={`INV-${invoice?.invoice_number}`}>
                  {({ blob, url, loading, error }) =>
                    loading ? 'Loading document...' : 'Download'
                  }
                </PDFDownloadLink>
              </Button>
              {/* <Button colorScheme="blue">
                <a href={instance.url} download="test.pdf">
                  Download
                </a>
              </Button> */}
              <Button onClick={onExportPDFClose}>Cancel</Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default InvoiceDetails;
