import React, { useEffect, useState, useContext, Fragment } from 'react';
import {
  Select,
  Badge,
  Textarea,
  Grid,
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
  InputGroup,
  InputLeftAddon,
  Button,
  FormHelperText,
  Text,
  useDisclosure,
  Container,
  Card,
  CardBody,
  Image,
  Divider,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Tooltip,
  Avatar,
  Accordion,
  Skeleton,
  useColorModeValue,
  IconButton,
  useEditableControls,
  ButtonGroup,
  Editable,
  EditablePreview,
  EditableInput,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast
} from '@chakra-ui/react';
// import {Link, Redirect, useHistory} from 'react-router-dom';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ReactPDF, { PDFViewer, usePDF } from '@react-pdf/renderer';
import {
  FiArrowLeft,
  FiBriefcase,
  FiCalendar,
  FiMoreHorizontal,
  FiUser,
  FiShare2,
  FiUploadCloud,
  FiPaperclip,
  FiSend,
  FiClock,
  FiAlignLeft,
  FiCircle,
  FiCheck,
  FiX,
  FiEdit,
  FiFolder,
  FiPlus,
  FiShare
} from 'react-icons/fi';
import { MdOutlinePayments, MdPendingActions, MdPayment } from 'react-icons/md';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { AiOutlineCheckCircle, AiOutlineBars } from 'react-icons/ai';
import { BiCalendarExclamation, BiNote, BiRuler } from 'react-icons/bi';
import { HiStatusOnline } from 'react-icons/hi';
import supabase from '../../utils/supabaseClient';
import formatMoneyValue from '../../utils/formatMoneyValue';
import formatNumber from '../../utils/formatNumber';
import formatDate from '../../utils/formatDate';
import { EditInvoiceForm, InvoiceDocument } from '../../components';
import DeleteInvoiceLineServiceAlertDialog from '../../components/Alerts/DeleteInvoiceLineServiceAlertDialog';
import { useServices } from '../../hooks/useServices';
import { useInvoiceStatuses } from '../../hooks/useInvoiceStatuses';

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
  const [invoicePayments, setInvoicePayments] = useState();
  const [invoiceServiceLineItems, setInvoiceServiceLineItems] = useState();
  const [selectedInvoiceLineService, setSelectedInvoiceLineService] = useState('');
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
  // const url = `http://${process.env.REACT_APP_BASE_URL}:8081/api`;
  let navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef();

  //React functions to load when component is rendering
  useEffect(() => {
    getInvoiceDetailsById();
    getAllInvoicePayments();
    getAllInvoiceServiceLineItems();
  }, []);

  // Function that call the supabase DB to get invoice info
  const getInvoiceDetailsById = async () => {
    const { data, error } = await supabase
      .from('invoice')
      .select(
        '*, customer:customer_id(*), invoice_status:invoice_status_id(*), service_type:service_type_id(*), invoice_line_service(*), payment(*)'
      )
      .eq('invoice_number', `${id}`);

    if (error) {
      console.log(error);
    }
    setInvoice(data[0]);
    console.log(data[0]);
  };

  // Get is a list of all payment associated to invoice number
  const getAllInvoicePayments = async () => {
    const { data, error } = await supabase.from('payment').select('*').eq('invoice_id', `${id}`);

    if (error) {
      console.log(error);
    }
    setInvoicePayments(data);
    console.log(data);
  };

  // Get a list of all service line items associated to invoice number
  const getAllInvoiceServiceLineItems = async () => {
    const { data, error } = await supabase
      .from('invoice_line_service')
      .select('*')
      .eq('invoice_id', `${id}`);

    if (error) {
      console.log(error);
    }

    setInvoiceServiceLineItems(data);
    console.log(data);
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

  // Edtiable buttons to confirm changes made in this editable changes
  function EditableControls() {
    const { isEditing, getSubmitButtonProps, getCancelButtonProps, getEditButtonProps } =
      useEditableControls();

    return isEditing ? (
      <ButtonGroup justifyContent="center" size="sm" w="full" spacing={2} mt={2}>
        <IconButton icon={<FiCheck />} {...getSubmitButtonProps()} />
        <IconButton icon={<FiX boxSize={3} />} {...getCancelButtonProps()} />
      </ButtonGroup>
    ) : null;
  }

  // Handle the editable fields to update the invoice database
  const handleEditableFields = async (invoice_number) => {
    const { data, error } = await supabase
      .from('invoice')
      .update({})
      .eq('invoice_number', invoice_number);
  };

  //////////////////////////// Functions that handle payments functionality /////////////////////////////////////////
  const handleAddPaymentSubmit = async (e) => {
    setLoadingState(true);
    e.preventDefault();

    const { data, error } = await supabase.from('payment').insert({
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
      await getAllInvoicePayments();
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
    const { data, error } = await supabase.from('payment').delete().eq('id', item_id);

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
      await getAllInvoicePayments();
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
      await getAllInvoiceServiceLineItems();
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
      await getAllInvoiceServiceLineItems();
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
        status: 'success',
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

  return (
    <Container maxW={'1400px'} pt={'1rem'} pb={'4rem'}>
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
      {/* Header */}
      <Flex justify={'space-between'} mb={'1rem'} flexDir={{ base: 'row', lg: 'row' }}>
        <Flex px={'1rem'} gap={4} mb={{ base: '0rem', lg: '0' }}>
          <Link to={`/invoices`}>
            <Button borderColor={'gray.300'} colorScheme={'gray'}>
              <FiArrowLeft />
            </Button>
          </Link>
          {/* <Text my={'auto'} fontSize={'xl'} fontWeight={'bold'}>INV #{id}</Text> */}
        </Flex>
        <Flex px={'1rem'} gap={4} ml={{ base: 'auto', lg: '0' }}>
          <Menu>
            <MenuButton as={Button}>
              <FiMoreHorizontal />
            </MenuButton>
            <MenuList>
              <MenuItem icon={<FiEdit />} onClick={() => handleEditInvoiceModal(invoice)}>
                Edit Invoice
              </MenuItem>
              <MenuItem icon={<MdOutlinePayments />}>Edit Payments</MenuItem>
              <MenuItem icon={<AiOutlineBars />}>Edit Line Items</MenuItem>
            </MenuList>
          </Menu>
          {/* <Tooltip hasArrow label="More"><Button colorScheme={'gray'}><FiMoreHorizontal/></Button></Tooltip> */}
          {/* <Tooltip hasArrow label="Share">
            <Button colorScheme={'gray'}>
              <FiShare2 />
            </Button>
          </Tooltip> */}
          {/* <Tooltip hasArrow label="Send invoice">
            <Button colorScheme={'blue'} gap={2}>
              <FiSend />
              Send invoice
            </Button>
          </Tooltip> */}
          <Button colorScheme={'blue'} onClick={onExportPDFOpen} gap={2}>
            <FiShare />
            Export as PDF
          </Button>
        </Flex>
      </Flex>
      <Flex px={'1rem'} gap={4} flexDir={{ base: 'column', lg: 'row' }}>
        {/* Left Section */}
        <Flex w={{ base: 'full', lg: '60%' }}>
          <Card w={'full'} rounded={'xl'}>
            <CardBody>
              {/* Header with Buttons */}
              <Flex justifyContent={'flex-end'} pr={'1rem'}>
                <Tooltip hasArrow label="Upload images">
                  <Button variant={'outline'} roundedRight={'none'}>
                    <FiUploadCloud />
                  </Button>
                </Tooltip>
                <Tooltip hasArrow label="Upload documents">
                  <Button variant={'outline'} roundedLeft={'none'}>
                    <FiPaperclip />
                  </Button>
                </Tooltip>
              </Flex>
              <Flex px={'2rem'} pb="3rem">
                <Image
                  src="https://github.com/rrios4/roofing-webapp/blob/main/src/assets/LogoRR.png?raw=true"
                  maxW={'70px'}
                  p={'1'}
                  bg={'blue.500'}
                  rounded={'2xl'}
                />
                <Box ml={'2rem'}>
                  <Text fontWeight={'semibold'} fontSize={'3xl'} letterSpacing={'0px'}>
                    Invoice{' '}
                    <Text as={'span'} color={'blue.400'}>
                      #
                    </Text>{' '}
                    {formatNumber(invoice?.invoice_number)}
                  </Text>
                  <Text fontSize={'sm'} fontWeight={'semibold'} textColor={'gray.500'}>
                    Due {formatDate(invoice?.due_date)}
                  </Text>
                </Box>
              </Flex>
              <Box px={'2rem'} mb={'3rem'}>
                <Flex mb={'1rem'}>
                  <Text w="50px" fontWeight={'bold'} textColor={'gray.500'}>
                    To
                  </Text>
                  {!invoice ? (
                    <Skeleton
                      bg={paymentCardBgColor}
                      height={'100px'}
                      w={'250px'}
                      rounded={'xl'}
                      mx={'1rem'}
                    />
                  ) : (
                    <>
                      {invoice?.bill_to === true ? (
                        <>
                          <Box>
                            <Text ml={'3rem'} fontWeight={'semibold'}>
                              {invoice?.customer.first_name} {invoice?.customer.last_name}
                            </Text>
                            <Text ml={'3rem'}>{invoice?.bill_to_street_address}</Text>
                            <Text ml={'3rem'}>
                              {invoice?.bill_to_city}, {invoice?.bill_to_state}{' '}
                              {invoice?.bill_to_zipcode}
                            </Text>
                            <Text ml={'3rem'} color={'blue.400'}>
                              {invoice?.customer.email}
                            </Text>
                          </Box>
                        </>
                      ) : (
                        <>
                          <Box>
                            <Text ml={'3rem'} fontWeight={'semibold'}>
                              {invoice?.customer.first_name} {invoice?.customer.last_name}
                            </Text>
                            <Text ml={'3rem'}>{invoice?.customer.street_address}</Text>
                            <Text ml={'3rem'}>
                              {invoice?.customer.city}, {invoice?.customer.state}{' '}
                              {invoice?.customer.zipcode}
                            </Text>
                            <Text ml={'3rem'} color={'blue.400'}>
                              {invoice?.customer.email}
                            </Text>
                          </Box>
                        </>
                      )}
                    </>
                  )}
                </Flex>
                <Flex mb={'1rem'}>
                  <Text w="50px" fontWeight={'bold'} textColor={'gray.500'}>
                    From
                  </Text>
                  {!invoice ? (
                    <Skeleton
                      bg={paymentCardBgColor}
                      height={'100px'}
                      w={'250px'}
                      rounded={'xl'}
                      mx={'1rem'}
                    />
                  ) : (
                    <>
                      <Box>
                        <Text ml={'3rem'} fontWeight={'semibold'}>
                          Rios Roofing
                        </Text>
                        <Text ml={'3rem'}>150 Tallant St</Text>
                        <Text ml={'3rem'}>Houston, TX 77076</Text>
                        <Text ml={'3rem'} color={'blue.400'}>
                          rrios.roofing@gmail.com
                        </Text>
                      </Box>
                    </>
                  )}
                </Flex>
                <Flex>
                  <Text w="50px" fontWeight={'bold'} textColor={'gray.500'}>
                    Notes
                  </Text>
                  {!invoice ? (
                    <Skeleton
                      bg={paymentCardBgColor}
                      height={'20px'}
                      w={'250px'}
                      rounded={'xl'}
                      mx={'1rem'}
                    />
                  ) : (
                    <>
                      <Text ml={'3rem'}>{invoice?.cust_note}</Text>
                    </>
                  )}
                </Flex>
              </Box>
              <Divider w={'95%'} mx={'auto'} />
              {/* Line Item Table */}
              <Box px={'2rem'} py={'2rem'}>
                <TableContainer rounded={'xl'}>
                  {!invoice ? (
                    <Skeleton bg={paymentCardBgColor} height={'100px'} w={'full'} rounded={'xl'} />
                  ) : (
                    <>
                      <Table variant={'simple'}>
                        <Thead bg={bgColorMode} rounded={'xl'}>
                          <Tr>
                            <Th>Description</Th>
                            <Th>Qty</Th>
                            <Th>Rate</Th>
                            <Th>Amount</Th>
                            {editSwitchIsOn === true ? <Th></Th> : <></>}
                          </Tr>
                        </Thead>
                        <Tbody>
                          {/* Table Row Data Component */}
                          {invoice?.invoice_line_service?.map((item, index) => (
                            <Tr key={index}>
                              <Td whiteSpace="normal" height="auto" blockSize="auto">
                                {item.description}
                              </Td>
                              <Td>{item.qty}</Td>
                              <Td>{item.item_rate === true ? item.rate : 'Fixed'}</Td>
                              <Td>${formatMoneyValue(item.amount)}</Td>
                              {editSwitchIsOn === true ? (
                                <Td>
                                  <IconButton
                                    icon={<FiX />}
                                    onClick={() =>
                                      handleLineItemDelete(item.id, item.description, item.amount)
                                    }
                                  />
                                </Td>
                              ) : (
                                <></>
                              )}
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </>
                  )}
                </TableContainer>
              </Box>

              <Box px={'4rem'} pb="0rem">
                <Flex mb={'0rem'} mx={8} py={2}>
                  <Text fontWeight={'semibold'} textColor={secondaryTextColor}>
                    Subtotal
                  </Text>
                  <Text ml={'auto'} mr={'1rem'}>
                    ${formatMoneyValue(invoice?.total)}
                  </Text>
                </Flex>
                <Flex mb={'1rem'} mx={8} py={2}>
                  <Text fontWeight={'semibold'} textColor={secondaryTextColor}>
                    Total
                  </Text>
                  <Text ml={'auto'} mr={'1rem'}>
                    ${formatMoneyValue(invoice?.total)}
                  </Text>
                </Flex>
                <Flex my={'3rem'} bg={'blue.500'} color={'white'} px={4} py={4} rounded={'xl'}>
                  <Text fontWeight={'bold'} fontSize={'xl'}>
                    Amount Due
                  </Text>
                  <Text ml={'auto'} fontWeight={'bold'} fontSize={'xl'}>
                    ${formatMoneyValue(invoice?.amount_due)}
                  </Text>
                </Flex>
              </Box>
            </CardBody>
          </Card>
        </Flex>
        {/* Right Section */}
        <Flex w={{ base: 'full', lg: '40%' }} direction={'column'} gap={3}>
          <Card rounded={'xl'} size="md">
            <CardBody>
              <Flex gap={2} justify={'center'}>
                {/* <Text fontSize={'2xl'} fontWeight={'bold'}>${formatMoneyValue(invoice?.amount_due)}</Text> */}
                {/* Menu Button to update status of invoice */}
                <Menu>
                  {({ isOpen }) => (
                    <>
                      <MenuButton
                        isLoading={loadingInvoiceStatusIsOn}
                        isActive={isOpen}
                        as={Button}
                        rightIcon={
                          isOpen ? <BsChevronDown size="10px" /> : <BsChevronUp size="10px" />
                        }>
                        {invoice?.invoice_status.name === 'Draft' ? (
                          <>
                            <Flex gap="2" pr="4">
                              <Box my="auto">
                                <FiFolder />
                              </Box>
                              {invoice?.invoice_status.name}
                            </Flex>
                          </>
                        ) : invoice?.invoice_status.name === 'Pending' ? (
                          <>
                            <Flex gap="2">
                              <Box my="auto">
                                <MdPendingActions />
                              </Box>
                              {invoice?.invoice_status.name}
                            </Flex>
                          </>
                        ) : invoice?.invoice_status.name === 'Paid' ? (
                          <>
                            <Flex gap="2">
                              <Box my="auto">
                                <AiOutlineCheckCircle />
                              </Box>
                              {invoice?.invoice_status.name}
                            </Flex>
                          </>
                        ) : invoice?.invoice_status.name === 'Overdue' ? (
                          <>
                            <Flex gap="2">
                              <Box my="auto">
                                <BiCalendarExclamation />
                              </Box>
                              {invoice?.invoice_status.name}
                            </Flex>
                          </>
                        ) : (
                          <></>
                        )}
                      </MenuButton>
                      <MenuList>
                        <MenuItem onClick={() => handleInvoiceStatusMenuSelection(4)}>
                          <Flex gap="2">
                            <Box my="auto">
                              <FiFolder size="20px" />
                            </Box>
                            <Text>Draft</Text>
                            {invoice?.invoice_status.name === 'Draft' ? (
                              <Box my="auto" ml="1rem">
                                <FiCheck size="15px" />
                              </Box>
                            ) : (
                              <></>
                            )}
                          </Flex>
                        </MenuItem>
                        <MenuItem onClick={() => handleInvoiceStatusMenuSelection(1)}>
                          <Flex gap="2">
                            <Box my="auto">
                              <AiOutlineCheckCircle size="20px" />
                            </Box>
                            <Text>Paid</Text>
                            {invoice?.invoice_status.name === 'Paid' ? (
                              <Box my="auto" ml="1rem">
                                <FiCheck size="15px" />
                              </Box>
                            ) : (
                              <></>
                            )}
                          </Flex>
                        </MenuItem>
                        <MenuItem onClick={() => handleInvoiceStatusMenuSelection(2)}>
                          <Flex gap="2">
                            <Box my="auto">
                              <MdPendingActions size="20px" />
                            </Box>
                            <Text>Pending</Text>
                            {invoice?.invoice_status.name === 'Pending' ? (
                              <Box my="auto" ml="1rem">
                                <FiCheck size="15px" />
                              </Box>
                            ) : (
                              <></>
                            )}
                          </Flex>
                        </MenuItem>
                        <MenuItem onClick={() => handleInvoiceStatusMenuSelection(3)}>
                          <Flex gap="2">
                            <Box my="auto">
                              <BiCalendarExclamation size="20px" />
                            </Box>
                            <Text>Overdue</Text>
                            {invoice?.invoice_status.name === 'Overdue' ? (
                              <Box my="auto" ml="1rem">
                                <FiCheck size="15px" />
                              </Box>
                            ) : (
                              <></>
                            )}
                          </Flex>
                        </MenuItem>
                      </MenuList>
                    </>
                  )}
                </Menu>
                <Button leftIcon={<FiPlus />} onClick={onAddLineItemOpen}>
                  Line Item
                </Button>
                <Button leftIcon={<FiPlus />} onClick={onAddPaymentOpen}>
                  Payment
                </Button>
                <Tooltip hasArrow label="Edit">
                  <IconButton
                    icon={editSwitchIsOn === true ? <FiX /> : <FiEdit />}
                    onClick={() => setEditSwitchIsOn(!editSwitchIsOn)}
                  />
                </Tooltip>
              </Flex>
            </CardBody>
          </Card>
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
                        <Link to={`/editcustomer/${invoice?.customer.id}`}>
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
                      {invoice?.payment?.map((item, index) => (
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
          <ModalHeader>Preview Invoice PDF</ModalHeader>
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
              {/* <Button colorScheme="blue">
                <a href={instance.url} download="test.pdf">
                  Download
                </a>
              </Button> */}
              {/* <Button onClick={onExportPDFClose}>Cancel</Button> */}
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default InvoiceDetails;
