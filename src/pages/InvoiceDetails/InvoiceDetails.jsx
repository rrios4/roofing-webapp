import React, { useEffect, useState, useContext } from 'react';
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
import axios from 'axios';
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
  FiFolder
} from 'react-icons/fi';
import { MdOutlinePayments, MdPendingActions, MdPayment } from 'react-icons/md';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { AiOutlineDown, AiOutlineCheckCircle, AiOutlineBars } from 'react-icons/ai';
import { BiCalendarExclamation, BiNote, BiRuler } from 'react-icons/bi';
import { HiStatusOnline } from 'react-icons/hi';
import supabase from '../../utils/supabaseClient';
import formatMoneyValue from '../../utils/formatMoneyValue';
import formatNumber from '../../utils/formatNumber';
import formatDate from '../../utils/formatDate';
import { DeleteAlertDialog } from '../../components';
import DeleteInvoiceLineServiceAlertDialog from '../../components/Alerts/DeleteInvoiceLineServiceAlertDialog';

const InvoiceDetails = () => {
  // Chakra UI hooks
  const toast = useToast();
  const {
    isOpen: isAddPaymentOpen,
    onOpen: onAddPaymentOpen,
    onClose: onAddPaymentClose
  } = useDisclosure();

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

  // React state toggles
  const [editSwitchIsOn, setEditSwitchIsOn] = useState(false);
  const [loadingInvoiceStatusIsOn, setLoadingInvoiceStatusIsOn] = useState(false);
  const [loadingState, setLoadingState] = useState(false);

  // React Input States
  const [invoiceServiceInputField, setInvoiceServiceInputField] = useState('');
  const [invoiceDateInputField, setInvoiceDateInputField] = useState('');

  // React Add Payment Inputs States
  const [dateReceivedPaymentInput, setDateReceivedPaymnetInput] = useState('');
  const [paymentMethodPaymentInput, setPaymentMethodPaymentInput] = useState('');
  const [amountPaymentInput, setAmountPaymentInput] = useState('');

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
        '*, customer:customer_id(*), invoice_status:invoice_status_id(*), service_type:service_type_id(*)'
      )
      .eq('invoice_number', `${id}`);

    if (error) {
      console.log(error);
    }
    setInvoice(data[0]);
    // console.log(invoice)
  };

  // Get is a list of all payment associated to invoice number
  const getAllInvoicePayments = async () => {
    const { data, error } = await supabase
      .from('payment')
      .select('amount, payment_method, date_received')
      .eq('invoice_id', `${id}`);

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

  // Handle deleting a line item
  const handleLineItemDelete = async ({ line_item_id }) => {
    const { data, error } = await supabase.from('invoice_line_service');
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

  // Handle custom editable controls for line items

  // Upcoming functions & changes
  // Function to handle the updating of invoice status but might be done using forms
  // Modal to delete invoice just like in the invoices page
  // Drawer to update invoices such as the invoices page

  return (
    <Container maxW={'1400px'} pt={'2rem'} pb={'4rem'}>
      <DeleteInvoiceLineServiceAlertDialog
        toast={handleDeleteToast}
        updateParentState={getInvoiceDetailsById}
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
              <MenuItem icon={<FiEdit />}>Edit Invoice</MenuItem>
              <MenuItem icon={<MdOutlinePayments />}>Edit Payments</MenuItem>
              <MenuItem icon={<AiOutlineBars />}>Edit Line Items</MenuItem>
            </MenuList>
          </Menu>
          {/* <Tooltip hasArrow label="More"><Button colorScheme={'gray'}><FiMoreHorizontal/></Button></Tooltip> */}
          <Tooltip hasArrow label="Share">
            <Button colorScheme={'gray'}>
              <FiShare2 />
            </Button>
          </Tooltip>
          <Tooltip hasArrow label="Send invoice">
            <Button colorScheme={'blue'} gap={2}>
              <FiSend />
              Send invoice
            </Button>
          </Tooltip>
        </Flex>
      </Flex>
      <Flex px={'1rem'} gap={6} flexDir={{ base: 'column', lg: 'row' }}>
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
                    Due {invoice?.due_date}
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
                  {!invoiceServiceLineItems ? (
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
                          {invoiceServiceLineItems?.map((item, index) => (
                            <Tr key={index}>
                              <Td whiteSpace="normal" height="auto" blockSize="auto">
                                {item.description}
                              </Td>
                              <Td>{item.qty}</Td>
                              <Td>{item.item_rate === true ? item.rate : 'Fixed'}</Td>
                              <Td>${formatMoneyValue(item.amount)}</Td>
                              {editSwitchIsOn === true ? (
                                <Td>
                                  <IconButton icon={<FiX />} />
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
                <Flex mb={'2'} mx={8} py={2}>
                  <Text fontWeight={'semibold'} textColor={secondaryTextColor}>
                    Payments
                  </Text>
                </Flex>
                <Flex w="full" px={12} mb={6} gap="4">
                  <Flex direction="column" gap="4">
                    {invoicePayments?.map((item, index) => (
                      <>
                        <Flex key={index} gap="6">
                          <Box my="auto" w="5%">
                            <Box h="10px" w="10px" bg="green.300" rounded="full"></Box>
                          </Box>
                          <Text w="30%" fontWeight={'semibold'} textColor={secondaryTextColor}>
                            {formatDate(item.date_received)}
                          </Text>
                          <Text w="50%">{item.payment_method}</Text>
                          <Text ml="2rem" w="35%">
                            ${formatMoneyValue(item.amount)}
                          </Text>
                        </Flex>
                      </>
                    ))}
                  </Flex>
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
        <Flex w={{ base: 'full', lg: '40%' }} direction={'column'} gap={4}>
          <Card rounded={'xl'}>
            <CardBody>
              <Flex px={'8px'} gap={2}>
                {/* <Text fontSize={'2xl'} fontWeight={'bold'}>${formatMoneyValue(invoice?.amount_due)}</Text> */}
                {/* Menu Button to update status of invoice */}
                <Menu>
                  {({ isOpen }) => (
                    <>
                      <MenuButton
                        w="full"
                        isLoading={loadingInvoiceStatusIsOn}
                        isActive={isOpen}
                        as={Button}
                        rightIcon={
                          isOpen ? <BsChevronDown size="10px" /> : <BsChevronUp size="10px" />
                        }>
                        {invoice?.invoice_status.name === 'Draft' ? (
                          <>
                            <Flex gap="2">
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
                <Button w={'full'} onClick={onAddPaymentOpen}>
                  Add Payment
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
          <Card w={'full'} rounded={'xl'}>
            <CardBody overflowY={'auto'}>
              {/* Invoice Extra Details */}
              <Box px={'1rem'} py={'8px'}>
                <Flex alignItems={'center'} gap={3} mb={'1rem'}>
                  <FiAlignLeft size={'25px'} color="gray" />
                  <Text fontSize={'2xl'} fontWeight={'semibold'} color={secondaryTextColor}>
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
                      <Text mr={'1rem'}>{invoice?.invoice_date}</Text>
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
                      <Text mr={'1rem'}>{invoice?.issue_date}</Text>
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
                      <Box bg={paymentCardBgColor} p="2" rounded="xl">
                        <Textarea
                          border="none"
                          h={'100px'}
                          isReadOnly
                          value={!invoice?.note ? '❌ No note for this invoice...' : invoice?.note}
                        />
                        {/* {!invoice?.note ? '❌ No note for this invoice...' : <Text>{invoice.note}</Text>} */}
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
                      <Box bg={paymentCardBgColor} p="4" rounded="xl">
                        <Text>
                          {!invoice?.sqft_measurement
                            ? '❌ No measurement information...'
                            : invoice?.sqft_measurement}
                        </Text>
                      </Box>
                    </>
                  )}
                </Box>
              </Box>
            </CardBody>
          </Card>
        </Flex>
      </Flex>
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
    </Container>
  );
};

export default InvoiceDetails;
