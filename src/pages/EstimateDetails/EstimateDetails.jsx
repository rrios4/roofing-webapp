import React, { useEffect, useState, useContext } from 'react';
import {
  Select,
  Divider,
  Badge,
  Card,
  CardBody,
  Skeleton,
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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
  Image,
  TableContainer,
  Thead,
  Th,
  Tr,
  Td,
  Table,
  Tbody,
  IconButton,
  useToast,
  useColorModeValue,
  Avatar,
  Textarea
} from '@chakra-ui/react';
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  CheckIcon,
  CloseIcon,
  EditIcon
} from '@chakra-ui/icons';
//import {Link, Redirect, useHistory} from 'react-router-dom';
import { Link, useNavigate, useParams } from 'react-router-dom';
import supabase from '../../utils/supabaseClient.js';
import formatNumber from '../../utils/formatNumber.js';
import formatMoneyValue from '../../utils/formatMoneyValue.js';
import {
  FiArrowLeft,
  FiMoreHorizontal,
  FiEdit,
  FiShare2,
  FiSend,
  FiUploadCloud,
  FiPaperclip,
  FiClock,
  FiAlignLeft,
  FiCheck,
  FiX,
  FiFolder,
  FiBriefcase,
  FiCalendar,
  FiUser
} from 'react-icons/fi';
import { MdOutlinePayments, MdPendingActions } from 'react-icons/md';
import { AiOutlineBars } from 'react-icons/ai';
import { BiCalendarExclamation, BiNote, BiRuler } from 'react-icons/bi';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { HiStatusOnline } from 'react-icons/hi';
import { AiOutlineCheckCircle } from 'react-icons/ai';

const EstimateDetails = (props) => {
  const { parentData } = props;

  // React useState to store Objects
  const [quote, setQuote] = useState();
  const [quoteServiceLineItem, setQuoteServiceLineItem] = useState();

  // React useState switches
  const [loadingQuoteStatusIsOn, setLoadingQuoteStatusIsOn] = useState(false);
  const [editSwitchIsOn, setEditSwitchIsOn] = useState(false);

  // Chakra UI states
  // const toast = useToast()

  // Custom color configs for UX elements
  const bgColorMode = useColorModeValue('gray.100', 'gray.600');
  // const bg = useColorModeValue('white', 'gray.800');
  const paymentCardBgColor = useColorModeValue('gray.100', 'gray.600');
  const paymentBorderColor = useColorModeValue('gray.200', 'gray.400');
  const secondaryTextColor = useColorModeValue('gray.600', 'gray.300');

  // React States
  const [customer, setCustomer] = useState('');
  const [cuStatus, setCuStatus] = useState('');
  const [jobType, setJobType] = useState('');
  const [estDate, setEstDate] = useState('');
  const [expDate, setExpDate] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [quotePrice, setQuotePrice] = useState('');
  const [sqMeasurement, setSqMeasurement] = useState('');

  // Define variables
  const { id } = useParams();
  // const url = `http://${process.env.REACT_APP_BASE_URL}:8081/api`;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef();
  let navigate = useNavigate();

  // React functions
  useEffect(() => {
    getQuoteById();
    getQuoteLineItems();
  }, []);

  // Handle the GET request for Qoute data from DB
  const getQuoteById = async () => {
    const { data, error } = await supabase
      .from('quote')
      .select('*, customer:customer_id(*), quote_status:status_id(*), services:service_id(*)')
      .eq('quote_number', id);

    if (error) {
      console.log(error);
    }
    setQuote(data[0]);
    console.log(id);
    console.log(data);
  };

  // Handle the GET request for Quote Line Items data from DB
  const getQuoteLineItems = async () => {
    const { data, error } = await supabase.from('quote_line_item').select('*').eq('quote_id', id);

    if (error) {
      console.log(error);
    }
    setQuoteServiceLineItem(data);
    console.log(data);
  };

  // Handle quote status when selected in menu
  const handleQuoteStatusMenuSelection = async (status_id) => {
    setLoadingQuoteStatusIsOn(true);
    if (status_id === quote?.status_id) {
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
      await getQuoteById();
    }
    setLoadingQuoteStatusIsOn(false);
  };

  // Convert Quote to Invoice
  // Handle adding new line item to quote

  return (
    <Container maxW={'1400px'} pt={'2rem'} pb={'4rem'}>
      {/* <DeleteInvoiceLineServiceAlertDialog toast={handleDeleteToast} updateParentState={getInvoiceDetailsById} /> */}

      {/* Header */}
      <Flex justify={'space-between'} mb={'1rem'} flexDir={{ base: 'row', lg: 'row' }}>
        <Flex px={'1rem'} gap={4} mb={{ base: '0rem', lg: '0' }}>
          <Link to={`/estimates`}>
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
          <Tooltip hasArrow label="Send Quote">
            <Button colorScheme={'blue'} gap={2}>
              <FiSend />
              Send Quote
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
                    Quote{' '}
                    <Text as={'span'} color={'blue.400'}>
                      #
                    </Text>{' '}
                    {formatNumber(quote?.quote_number)}
                  </Text>
                  <Text fontSize={'sm'} fontWeight={'semibold'} textColor={'gray.500'}>
                    Expires {quote?.expiration_date}
                  </Text>
                </Box>
              </Flex>
              <Box px={'2rem'} mb={'3rem'}>
                <Flex mb={'1rem'}>
                  <Text w="50px" fontWeight={'bold'} textColor={'gray.500'}>
                    To
                  </Text>
                  {!quote ? (
                    <Skeleton
                      bg={paymentCardBgColor}
                      height={'100px'}
                      w={'250px'}
                      rounded={'xl'}
                      mx={'1rem'}
                    />
                  ) : (
                    <>
                      {quote?.bill_to === true ? (
                        <>
                          <Box>
                            <Text ml={'3rem'} fontWeight={'semibold'}>
                              {quote?.customer?.first_name} {quote?.customer?.last_name}
                            </Text>
                            <Text ml={'3rem'}>{quote?.bill_to_street_address}</Text>
                            <Text ml={'3rem'}>
                              {quote?.bill_to_city}, {quote?.bill_to_state} {quote?.bill_to_zipcode}
                            </Text>
                            <Text ml={'3rem'} color={'blue.400'}>
                              {quote?.customer?.email}
                            </Text>
                          </Box>
                        </>
                      ) : (
                        <>
                          <Box>
                            <Text ml={'3rem'} fontWeight={'semibold'}>
                              {quote?.customer?.first_name} {quote?.customer?.last_name}
                            </Text>
                            <Text ml={'3rem'}>{quote?.customer?.street_address}</Text>
                            <Text ml={'3rem'}>
                              {quote?.customer?.city}, {quote?.customer?.state}{' '}
                              {quote?.customer?.zipcode}
                            </Text>
                            <Text ml={'3rem'} color={'blue.400'}>
                              {quote?.customer?.email}
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
                  {!quote ? (
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
                  {/* <Text w="50px" fontWeight={'bold'} textColor={'gray.500'}>
                    Notes
                  </Text> */}
                  {!quote ? (
                    <Skeleton
                      bg={paymentCardBgColor}
                      height={'20px'}
                      w={'250px'}
                      rounded={'xl'}
                      mx={'1rem'}
                    />
                  ) : (
                    <>
                      <Text ml={'3rem'}>{quote?.cust_note}</Text>
                    </>
                  )}
                </Flex>
              </Box>
              <Divider w={'95%'} mx={'auto'} />

              {/* Line Item Table */}
              <Box px={'2rem'} py={'2rem'}>
                <TableContainer rounded={'xl'}>
                  {!quoteServiceLineItem ? (
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
                          {quoteServiceLineItem?.map((item, index) => (
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
              <Box px={'4rem'} pb="2rem">
                <Flex mb={'2rem'} px={4} py={2}>
                  <Text fontWeight={'semibold'} textColor={secondaryTextColor}>
                    Subtotal
                  </Text>
                  <Text ml={'auto'} mr={'1rem'}>
                    ${formatMoneyValue(quote?.subtotal)}
                  </Text>
                </Flex>
                <Flex mb={'2rem'} bg={'blue.500'} color={'white'} px={4} py={4} rounded={'xl'}>
                  <Text fontWeight={'bold'} fontSize={'xl'}>
                    Total
                  </Text>
                  <Text ml={'auto'} fontWeight={'bold'} fontSize={'xl'}>
                    ${formatMoneyValue(quote?.total)}
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
                {/* <Text fontSize={'2xl'} fontWeight={'bold'}>${formatMoneyValue(quote?.amount_due)}</Text> */}
                {/* Menu Button to update status of invoice */}
                <Menu>
                  {({ isOpen }) => (
                    <>
                      <MenuButton
                        w="full"
                        isLoading={loadingQuoteStatusIsOn}
                        isActive={isOpen}
                        as={Button}
                        rightIcon={
                          isOpen ? <BsChevronDown size="10px" /> : <BsChevronUp size="10px" />
                        }>
                        {quote?.quote_status?.name === 'Draft' ? (
                          <>
                            <Flex gap="2">
                              <Box my="auto">
                                <FiFolder />
                              </Box>
                              {quote?.quote_status?.name}
                            </Flex>
                          </>
                        ) : quote?.quote_status?.name === 'Pending' ? (
                          <>
                            <Flex gap="2">
                              <Box my="auto">
                                <MdPendingActions />
                              </Box>
                              {quote?.quote_status?.name}
                            </Flex>
                          </>
                        ) : quote?.quote_status?.name === 'Accepted' ? (
                          <>
                            <Flex gap="2">
                              <Box my="auto">
                                <AiOutlineCheckCircle />
                              </Box>
                              {quote?.quote_status?.name}
                            </Flex>
                          </>
                        ) : quote?.quote_status?.name === 'Rejected' ? (
                          <>
                            <Flex gap="2">
                              <Box my="auto">
                                <BiCalendarExclamation />
                              </Box>
                              {quote?.quote_status?.name}
                            </Flex>
                          </>
                        ) : (
                          <></>
                        )}
                      </MenuButton>
                      <MenuList>
                        <MenuItem onClick={() => handleQuoteStatusMenuSelection(4)}>
                          <Flex gap="2">
                            <Box my="auto">
                              <FiFolder size="20px" />
                            </Box>
                            <Text>Draft</Text>
                            {quote?.quote_status?.name === 'Draft' ? (
                              <Box my="auto" ml="1rem">
                                <FiCheck size="15px" />
                              </Box>
                            ) : (
                              <></>
                            )}
                          </Flex>
                        </MenuItem>
                        <MenuItem onClick={() => handleQuoteStatusMenuSelection(1)}>
                          <Flex gap="2">
                            <Box my="auto">
                              <AiOutlineCheckCircle size="20px" />
                            </Box>
                            <Text>Accepted</Text>
                            {quote?.quote_status?.name === 'Accepted' ? (
                              <Box my="auto" ml="1rem">
                                <FiCheck size="15px" />
                              </Box>
                            ) : (
                              <></>
                            )}
                          </Flex>
                        </MenuItem>
                        <MenuItem onClick={() => handleQuoteStatusMenuSelection(2)}>
                          <Flex gap="2">
                            <Box my="auto">
                              <MdPendingActions size="20px" />
                            </Box>
                            <Text>Pending</Text>
                            {quote?.quote_status?.name === 'Pending' ? (
                              <Box my="auto" ml="1rem">
                                <FiCheck size="15px" />
                              </Box>
                            ) : (
                              <></>
                            )}
                          </Flex>
                        </MenuItem>
                        <MenuItem onClick={() => handleQuoteStatusMenuSelection(3)}>
                          <Flex gap="2">
                            <Box my="auto">
                              <BiCalendarExclamation size="20px" />
                            </Box>
                            <Text>Rejected</Text>
                            {quote?.quote_status?.name === 'Rejected' ? (
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
                <Button w={'full'}>Add Payment</Button>
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
                  {!quote ? (
                    <Skeleton bg={paymentCardBgColor} height={'20px'} rounded={'xl'} w={'full'} />
                  ) : (
                    <Badge
                      colorScheme={
                        quote?.quote_status?.name === 'Accepted'
                          ? 'green'
                          : quote?.quote_status?.name === 'Pending'
                          ? 'yellow'
                          : quote?.quote_status?.name === 'Rejected'
                          ? 'red'
                          : quote?.quote_status?.name === 'Draft'
                          ? 'gray'
                          : 'facebook'
                      }
                      variant={'subtle'}
                      mr={'1rem'}
                      pt={'2px'}
                      w={'80px'}
                      rounded={'xl'}
                      textAlign={'center'}>
                      {quote?.quote_status?.name}
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
                  {!quote ? (
                    <Skeleton bg={paymentCardBgColor} height={'20px'} rounded={'xl'} w={'full'} />
                  ) : (
                    <Text mr={'1rem'}>{quote?.services?.name}</Text>
                  )}
                </Flex>
                <Flex mb={'1rem'} gap="2">
                  <Box my="auto">
                    <FiCalendar />
                  </Box>
                  <Text w={'40%'} fontWeight={'semibold'} textColor={secondaryTextColor}>
                    Quote Date
                  </Text>
                  {!quote ? (
                    <Skeleton bg={paymentCardBgColor} height={'20px'} rounded={'xl'} w={'full'} />
                  ) : (
                    <>
                      <Text mr={'1rem'}>{quote?.quote_date}</Text>
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
                  {!quote ? (
                    <Skeleton bg={paymentCardBgColor} height={'20px'} rounded={'xl'} w={'full'} />
                  ) : (
                    <>
                      <Text mr={'1rem'}>{quote?.issue_date}</Text>
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
                  {!quote ? (
                    <Skeleton bg={paymentCardBgColor} height={'20px'} rounded={'xl'} w={'full'} />
                  ) : (
                    <>
                      <Flex>
                        <Link to={`/editcustomer/${quote?.customer?.id}`}>
                          <Button variant={'ghost'}>
                            <Avatar size={'xs'} />
                            <Text my={'auto'} ml={'8px'} fontWeight={'medium'}>
                              {quote?.customer?.first_name} {quote?.customer?.last_name}
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
                  {!quote ? (
                    <Skeleton bg={paymentCardBgColor} height={'20px'} rounded={'xl'} />
                  ) : (
                    <>
                      <Box bg={paymentCardBgColor} p="2" rounded="xl">
                        <Textarea
                          border="none"
                          h={'100px'}
                          isReadOnly
                          value={!quote?.note ? '❌ No note for this invoice...' : quote?.note}
                        />
                        {/* {!quote?.note ? '❌ No note for this invoice...' : <Text>{invoice.note}</Text>} */}
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
                  {!quote ? (
                    <Skeleton bg={paymentCardBgColor} height={'20px'} rounded={'xl'} />
                  ) : (
                    <>
                      <Box bg={paymentCardBgColor} p="4" rounded="xl">
                        <Text>
                          {!quote?.measurement_note
                            ? '❌ No measurement information...'
                            : quote?.measurement_note}
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
    </Container>
    // <Flex direction='column' justifyContent='center' pb='1rem' pt='1rem' w={[300, 400, 800]} >
    //         <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
    //             <ModalOverlay />
    //             <ModalContent p='1rem' ml='6rem'>
    //                 <ModalHeader textAlign='center'>Edit Estimate</ModalHeader>
    //                 <Text color='red' textAlign='center'>Fill all fields please!</Text>
    //                 <ModalCloseButton />
    //                 <form method='PUT' onSubmit={''}>
    //                 <ModalBody>
    //                         <FormControl isRequired>
    //                             <FormLabel pt='1rem'>Estimate Date</FormLabel>
    //                             <Input type='date' value={estDate} onChange={({target}) => setEstDate(target.value)} id='invDate' placeholder='Invoice date'/>
    //                         </FormControl>
    //                         <FormControl isRequired>
    //                             <FormLabel pt='1rem'>Expiration Date</FormLabel>
    //                             <Input type='date' value={expDate} onChange={({target}) => setExpDate(target.value)} id='dueDate' placeholder='Due date'/>
    //                         </FormControl>
    //                         <FormControl isRequired>
    //                         <FormLabel pt='1rem'>Service Name</FormLabel>
    //                             <InputGroup>
    //                                 <Input value={serviceName} id='service' onChange={({target}) => setServiceName(target.value)} placeholder='Service Name' />
    //                             </InputGroup>
    //                         </FormControl>
    //                         <FormControl isRequired={true}>
    //                             <FormLabel pt='1rem'>Quoted Price</FormLabel>
    //                             <Input value={quotePrice} onChange={({target}) => setQuotePrice(target.value)} placeholder='Quote price' type='number'/>
    //                         </FormControl>
    //                         <FormControl isRequired={true}>
    //                             <FormLabel pt='1rem'>SQ FT Measurement</FormLabel>
    //                             <Input value={sqMeasurement} onChange={({target}) => setSqMeasurement(target.value)} placeholder='Square Feet' type='number'></Input>
    //                         </FormControl>
    //                 </ModalBody>
    //                 <ModalFooter>
    //                     <Button colorScheme='blue' mr={3} type='submit' onClick={''} >Save</Button>
    //                     <Button onClick={onClose} colorScheme='blue'>Cancel</Button>
    //                 </ModalFooter>
    //                 </form>
    //             </ModalContent>
    //         </Modal>
    //         <Link to='/estimates'>
    //         <Box display='flex' pt='1rem' pb='1rem' pl='1rem'>
    //             <Box display='flex' _hover={{color: 'blue.400'}}>
    //                 <ChevronLeftIcon fontSize='35px'/>
    //                 <Text _hover={{color: "blue.400"}} fontWeight='bold' fontSize='20px'>Go Back</Text>
    //             </Box>
    //         </Box>
    //     </Link>
    //             <Box display='flex' pt='1rem' justifyContent='center'>
    //                 <Box display='flex' p='1rem' bg='gray.600' rounded='2xl' shadow='md' w={[300, 400, 800]}>
    //                     <Box display='flex' mr='auto' pl='1rem'>
    //                         <Box display='flex' flexDir='column' justifyContent='center' pr='1rem'>
    //                             <Text fontWeight='light' fontSize='18px' color='white'>Status:</Text>
    //                         </Box>
    //                         <Box display='flex' flexDir='column' justifyContent='center' >
    //                             {/* <Badge colorScheme='yellow' variant='solid' p='8px'>{cuStatus.status_name}</Badge> */}
    //                             {statusBadge()}
    //                         </Box>
    //                     </Box>
    //                     <Box display='flex' pr='1rem'>
    //                         <Box pr='1rem' >
    //                             <Button colorScheme='yellow' onClick={''}>Mark Pending</Button>
    //                         </Box>
    //                         <Box pr='1rem'>
    //                             <Button colorScheme='green' onClick={'markEstimateApproved'}>Approved</Button>
    //                         </Box>
    //                         <Box pr='1rem' >
    //                             <Button colorScheme='red' onClick={'markEstimateExpired'}>Mark Expired</Button>
    //                         </Box>
    //                     </Box>
    //                 </Box>
    //             </Box>
    //             <Box display='flex' pt='2rem'  justifyContent='center' color='white'>
    //                 <Box display='flex' flexDir='column' p='1rem' rounded='2xl' bg='gray.600' shadow='md' w={[300, 400, 800]}>
    //                     <Box display='flex' justifyContent='flex-end' pr='2rem' pt='1rem'>
    //                         <Box pr='1rem' >
    //                             <Button bg='white' color='green' onClick={convertToInvoice}>Convert To Invoice</Button>
    //                         </Box>
    //                         <Box>
    //                             <Button colorScheme='blue' onClick={onOpen}>Edit</Button>
    //                         </Box>
    //                         <Box pl='1rem'>
    //                             <Button colorScheme='red' onClick={'deleteEstimate'}>Delete</Button>
    //                         </Box>
    //                     </Box>
    //                     <Box display='flex' p='2rem' bg='gray.600' rounded='xl'>
    //                         <Box>
    //                             <Text fontSize='22px' fontWeight='bold' letterSpacing='1px'>Estimate #{invoice.id}</Text>
    //                             <Text  fontSize='20px' fontWeight='light' letterSpacing='1px'>{jobType.type_name}</Text>
    //                         </Box>
    //                         <Box display='flex' flexDir='column' ml='auto' >
    //                             <Text textAlign='right' fontWeight='bold'>Rios Roofing</Text>
    //                             <Text textAlign='right' fontWeight='light'>150 Tallant St</Text>
    //                             <Text textAlign='right' fontWeight='light'>Houston, TX</Text>
    //                             <Text textAlign='right' fontWeight='light'>77076</Text>
    //                             <Text textAlign='right' fontWeight='light'>United States</Text>
    //                         </Box>
    //                     </Box>
    //                     <Box display='flex' justifyContent='center' p='1rem' pt='1rem' pb='1rem'>
    //                         <Box display='flex' flexDir='column' p='1rem' >
    //                             <Box pb='1rem'>
    //                                 {/* <Editable defaultValue={customer?.name}>
    //                                     <EditablePreview/>
    //                                     <EditableInput/>
    //                                     <EditableControls/>
    //                                 </Editable> */}
    //                                 <Text fontSize='22px' fontWeight='bold'>Estimate Date:</Text>
    //                                 <Text>{new Date(invoice.estimate_date).toLocaleDateString()}</Text>
    //                             </Box>
    //                             <Box>
    //                                 <Text fontSize='22px' fontWeight='bold'>Expiration Date:</Text>
    //                                 <Text>{new Date(invoice.exp_date).toLocaleDateString()}</Text>
    //                             </Box>
    //                         </Box>
    //                         <Box display='flex' flexDir='column' p='1rem' ml='auto' mr='auto'>
    //                             <Box>
    //                                 <Text fontSize='22px' fontWeight='bold' letterSpacing='1px'>EST For:</Text>
    //                             </Box>
    //                             <Box pb='4px'>
    //                                 <Text letterSpacing='1px'>{customer.name}</Text>
    //                             </Box>
    //                             <Box>
    //                                 <Text fontWeight='light' letterSpacing='1px'>{customer.address},</Text>
    //                             </Box>
    //                             <Box>
    //                                 <Text fontWeight='light' letterSpacing='1px'>{customer.city}, {customer.state},</Text>
    //                             </Box>
    //                             <Box>
    //                                 <Text fontWeight='light' letterSpacing='1px'>{customer.zipcode}</Text>
    //                             </Box>
    //                             <Box>
    //                                 <Text letterSpacing='1px'>United States</Text>
    //                             </Box>

    //                         </Box>
    //                         <Box display='flex' flexDir='column' p='1rem'>
    //                             <Box>
    //                                 <Text fontSize='22px' fontWeight='bold'>Email To: </Text>
    //                             </Box>
    //                             <Text letterSpacing='1px'>{customer.email}</Text>
    //                         </Box>
    //                     </Box>
    //                     <Box display='flex' flexDir='column' p='1rem' >
    //                         <Box display='flex' flexDir='column' bg='gray.700' p='1rem' roundedTop='xl'>
    //                             <Box display='flex' justifyContent='space-between' >
    //                                     <Box ml='1rem'>
    //                                         <Text letterSpacing='1px' fontSize='18px' fontWeight='bold'>Service Name</Text>
    //                                     </Box>
    //                                     <Box>
    //                                         {/* <Text letterSpacing='1px' fontSize='18px' fontWeight='bold'>QTY.</Text> */}
    //                                     </Box>
    //                                     <Box>
    //                                         <Text letterSpacing='1px' fontSize='18px' fontWeight='bold'>Price</Text>
    //                                     </Box>
    //                                     <Box mr='1rem'>
    //                                         <Text letterSpacing='1px' fontSize='18px' fontWeight='bold'>Total</Text>
    //                                     </Box>
    //                             </Box>
    //                             <Box display='flex' justifyContent='space-between' pt='1rem' pb='1rem' >
    //                                     <Box ml='1rem'>
    //                                         <Text letterSpacing='1px' fontSize='16px' fontWeight='light'>{invoice.service_name}</Text>
    //                                     </Box>
    //                                     <Box>
    //                                         <Text letterSpacing='1px' fontSize='16px' fontWeight='bold'>{`${invoice.sqft_measurement} sqft.`}</Text>
    //                                     </Box>
    //                                     <Box>
    //                                         <Text letterSpacing='1px' fontSize='16px' fontWeight='bold'>{invoice.quote_price}</Text>
    //                                     </Box>
    //                                     <Box mr='1rem'>
    //                                         <Text letterSpacing='1px'  fontSize='16px' fontWeight='bold'>{invoice.quote_price}</Text>
    //                                     </Box>
    //                             </Box>
    //                         </Box>
    //                         <Box display='flex'  bg='blue.600' p='2rem' roundedBottom='xl'>
    //                                 <Box ml='auto'>
    //                                     <Text fontWeight='bold' letterSpacing='1px' fontSize='22px'>Estimated Price:</Text>
    //                                 </Box>
    //                                 <Box ml='4rem' >
    //                                     <Text fontWeight='bold' letterSpacing='1px' fontSize='22px'>{invoice.quote_price}</Text>
    //                                 </Box>
    //                             </Box>

    //                     </Box>
    //                     <Grid>

    //                     </Grid>
    //                 </Box>
    //             </Box>
    //     </Flex>
  );
};

export default EstimateDetails;
