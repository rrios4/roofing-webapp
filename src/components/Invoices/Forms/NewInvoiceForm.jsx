import React, { useState, useEffect } from 'react';
import { MultiPurposeOptions } from '../..';
import { supabase } from '../../../utils';
import AsyncSelect from 'react-select/async';
import {
  Text,
  FormControl,
  FormLabel,
  Select,
  Input,
  Button,
  useColorModeValue,
  useColorMode,
  Flex,
  Textarea,
  Box,
  Switch,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  DrawerFooter,
  Drawer,
  DrawerOverlay,
  DrawerHeader,
  DrawerBody,
  DrawerContent,
  DrawerCloseButton
} from '@chakra-ui/react';
import formatMoneyValue from '../../../utils/formatMoneyValue';
import { TbNote, TbRuler } from 'react-icons/tb';
import { FiMap, FiUser } from 'react-icons/fi';

const NewInvoiceForm = (props) => {
  const {
    onNewClose,
    isNewOpen,
    initialRef,
    data,
    updateParentData,
    toast,
    services,
    invoiceStatuses
  } = props;

  // React styling hooks
  const { colorMode } = useColorMode();
  const bg = useColorModeValue('white', 'gray.800');
  const tableHeaderColor = useColorModeValue('blue.400', 'blue.600');

  // Select & Options React States
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [serviceLineItems, setServiceLineItems] = useState();
  const [selectedServiceType, setSelectedServiceType] = useState('');
  const [selectedInvoiceStatus, setSelectedInvoiceStatus] = useState('');
  const [nextInvoiceNumber, setNextInvoiceNumber] = useState('');

  // Input React States
  const [invoiceNumberInput, setInvoiceNumberInput] = useState('');
  const [invoiceDateInput, setInvoiceDateInput] = useState('');
  const [invoiceDueDateInput, setInvoiceDueDateInput] = useState('');
  const [sqftInput, setSqftInput] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [billToStreetAddressInput, setBillToStreetAddressInput] = useState('');
  const [billToCityInput, setBillToCityInput] = useState('');
  const [billToStateInput, setBillToStateInput] = useState('');
  const [billToZipcodeInput, setBillToZipcodeInput] = useState('');
  const [customerNoteMessage, setCustomerNoteMessage] = useState('');
  const [invoiceTotalCalculatedValue, setInvoiceTotalCalculatedValue] = useState(0);
  const [invoiceSubTotalCalculatedvalue, setInvoiceSubTotalCalculatedvalue] = useState(0);
  // const [lineItemDescriptionInput, setLineItemDescriptionInput] = useState('');
  // const [lineItemQty, setLineItemQty] = useState('');
  // const [lineItemRate, setLineItemRate] = useState('');

  // New States That I'm currently working with
  // Switch React States
  const [fixedRateSwitchIsOn, setFixedRateSwitchIsOn] = useState(true);
  const [billToSwitchIsOn, setBillToSwitchIsOn] = useState(false);
  const [noteSwitchIsOn, setNoteSwitchIsOn] = useState(false);
  const [measurementNoteSwitchIsOn, setMeasurementNoteSwitchIsOn] = useState(false);
  const [customerNoteSwitchIsOn, setCustomerNoteSwitchIsOn] = useState(false);
  const [loadingState, setLoadingState] = useState(false);

  // Line Item React State
  const [lineItemList, setLineItemList] = useState([
    {
      description: '',
      qty: '',
      rate: '',
      amount: 0
    }
  ]);
  const [numOfLineItemFields, setNumOfLineItemFields] = useState(1);

  // Function to handle the submit data from the form to supabase DB
  const handleSubmit = async (event) => {
    setLoadingState(true);
    event.preventDefault();
    // POST request to supabase to save new invoice
    const { data, error } = await supabase.from('invoice').insert([
      {
        invoice_number: invoiceNumberInput,
        customer_id: selectedCustomer.selectedCustomer.value,
        service_type_id: selectedServiceType,
        invoice_status_id: selectedInvoiceStatus,
        invoice_date: invoiceDateInput,
        due_date: invoiceDueDateInput,
        sqft_measurement: sqftInput ? sqftInput : null,
        note: noteInput ? noteInput : null,
        cust_note:
          customerNoteSwitchIsOn === true ? customerNoteMessage : 'Thank you for your business! 🚀',
        bill_to_street_address: billToSwitchIsOn === true ? billToStreetAddressInput : null,
        bill_to_city: billToSwitchIsOn === true ? billToCityInput : null,
        bill_to_state: billToSwitchIsOn === true ? billToStateInput : null,
        bill_to_zipcode: billToSwitchIsOn === true ? billToZipcodeInput : null,
        bill_from_email: 'rrios.roofing@gmail.com',
        bill_from_street_address: '150 Tallant St',
        bill_from_city: 'Houston',
        bill_from_state: 'TX',
        bill_from_zipcode: '77076',
        bill_to: billToSwitchIsOn === true ? true : false,
        subtotal: invoiceSubTotalCalculatedvalue >= 0 ? invoiceSubTotalCalculatedvalue : 0,
        total: invoiceTotalCalculatedValue >= 0 ? invoiceTotalCalculatedValue : 0,
        amount_due: invoiceTotalCalculatedValue >= 0 ? invoiceTotalCalculatedValue : 0
      }
    ]);

    if (error) {
      // console.log(error);
      // Handles feedback toast when there is an error creating new invoice
      toast({
        position: 'top',
        title: `Error Occured Creating New Invoice`,
        description: `Error: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }

    if (data) {
      await handleLineItemSubmit();

      // Toast Feedback when invoice was created sucessfully
      toast({
        position: 'top',
        title: `Invoice #${invoiceNumberInput} was created succesfully! 🎉`,
        description: "We've sucessfully created an invoice for you!",
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    }

    // Set line items to 0 in total and number of lines
    setLineItemList([]);
    setNumOfLineItemFields(0);
    setInvoiceTotalCalculatedValue(0);
    setInvoiceSubTotalCalculatedvalue(0);

    // Setting input fields to empty
    setInvoiceNumberInput('');
    setSelectedCustomer('');
    setSelectedServiceType('');
    setSelectedInvoiceStatus('');
    setInvoiceDateInput('');
    setInvoiceDueDateInput('');
    setSqftInput('');
    setNoteInput('');
    setBillToCityInput('');
    setBillToStateInput('');
    setBillToStreetAddressInput('');
    setBillToZipcodeInput('');
    setCustomerNoteMessage('');
    setFixedRateSwitchIsOn(true);
    setBillToSwitchIsOn(false);
    setNoteSwitchIsOn(false);
    setMeasurementNoteSwitchIsOn(false);
    setCustomerNoteSwitchIsOn(false);
    setLoadingState(false);

    await updateParentData();
    onNewClose();
  };

  // Function that will handle the selected value from react-select component and stores it in a useState
  const handleSelectedCustomer = (value) => {
    setSelectedCustomer({
      selectedCustomer: value || []
    });
    // console.log(selectedCustomer.selectedCustomer.value)
  };

  // Function that will load options for react-select component as the user types name
  const loadOptions = async (inputText, callback) => {
    //Use supabase SDK to return a list of all customers to be used by react-select as options
    const { data: customers, error } = await supabase
      .from('customer')
      .select('first_name, last_name, customer_type_id, id, email')
      .or(
        `first_name.ilike.%${inputText}%,last_name.ilike.%${inputText}%,email.ilike.%${inputText}%`
      );

    if (error) {
      console.log(error);
    }
    callback(
      customers.map((customer) => ({
        label: `${customer.first_name} ${customer.last_name}`,
        value: customer.id,
        email: customer.email
      }))
    );
    // console.log(customers)
  };

  //////////////////////////// Functions that handle line item logic ///////////////////////////////
  // Delete Line Item Field
  const handleDeleteLineItemField = (index) => {
    const list = lineItemList;
    console.log(numOfLineItemFields);
    list.pop();
    setLineItemList(list);
    setNumOfLineItemFields(numOfLineItemFields - 1);
    console.log(lineItemList);
    setInvoiceTotalCalculatedValue(
      lineItemList.reduce(
        (total, currentItem) => (total = parseFloat(total) + parseFloat(currentItem.amount)),
        0
      )
    );
    setInvoiceSubTotalCalculatedvalue(
      lineItemList.reduce(
        (total, currentItem) => (total = parseFloat(total) + parseFloat(currentItem.amount)),
        0
      )
    );
  };

  // Handle adding new line items to be stored in a react useState
  const handleAddingLineItem = (newLineItem) => {
    setNumOfLineItemFields(numOfLineItemFields + 1);
    // setServiceLineItems(prevServiceLineItems => [...prevServiceLineItems, newLineItem])
    setLineItemList([
      ...lineItemList,
      {
        description: '',
        qty: '',
        rate: '',
        amount: 0
      }
    ]);
    console.log(lineItemList);
  };

  // Handle change of input fields
  const handleOnChangeLineItemInput = (e, index) => {
    const { name, value } = e.target;
    const list = [...lineItemList];
    list[index][name] = value;
    setLineItemList(list);
    setInvoiceTotalCalculatedValue(
      lineItemList.reduce(
        (total, currentItem) => (total = parseFloat(total) + parseFloat(currentItem.amount)),
        0
      )
    );
    setInvoiceSubTotalCalculatedvalue(
      lineItemList.reduce(
        (total, currentItem) => (total = parseFloat(total) + parseFloat(currentItem.amount)),
        0
      )
    );
  };

  ////////////// Fuction to handle when user press cancel ///////////////////////
  // Handle cancel button to clear all states such when the submit happens
  const handleCancelButton = () => {
    onNewClose();
    setLineItemList([]);
    setNumOfLineItemFields(0);
    setInvoiceTotalCalculatedValue(
      lineItemList.reduce(
        (total, currentItem) => (total = parseFloat(total) + parseFloat(currentItem.amount)),
        0
      )
    );
    setInvoiceSubTotalCalculatedvalue(
      lineItemList.reduce(
        (total, currentItem) => (total = parseFloat(total) + parseFloat(currentItem.amount)),
        0
      )
    );

    setInvoiceNumberInput('');
    setSelectedCustomer('');
    setSelectedServiceType('');
    setSelectedInvoiceStatus('');
    setInvoiceDateInput('');
    setInvoiceDueDateInput('');
    setSqftInput('');
    setNoteInput('');
    setBillToCityInput('');
    setBillToStateInput('');
    setBillToStreetAddressInput('');
    setBillToZipcodeInput('');
    setCustomerNoteMessage('');
    setFixedRateSwitchIsOn(true);
    setBillToSwitchIsOn(false);
    setNoteSwitchIsOn(false);
    setMeasurementNoteSwitchIsOn(false);
    setCustomerNoteSwitchIsOn(false);
  };

  const handleLineItemSubmit = async () => {
    lineItemList.map(async (item) => {
      const { error } = await supabase.from('invoice_line_service').insert([
        {
          invoice_id: parseInt(invoiceNumberInput),
          service_id: parseInt(selectedServiceType),
          fixed_item: fixedRateSwitchIsOn,
          description: item.description,
          qty: fixedRateSwitchIsOn === true ? 1 : 1,
          rate: fixedRateSwitchIsOn === true ? null : parseInt(item.rate),
          amount: item.amount,
          sq_ft: fixedRateSwitchIsOn === true ? null : parseInt(item.sq_ft)
        }
      ]);

      if (error) {
        // console.log(error);

        // Toast Feedback when invoice line-item creation failed
        toast({
          position: 'top',
          title: `Error occured creating line-item`,
          description: `Error: ${error.message}`,
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      }
    });
    // console.log({
    //     invoice_id: parseInt(invoiceNumberInput),
    //     service_id: selectedServiceType,
    //     fixed_item: fixedRateSwitchIsOn,
    //     item_list: lineItemList
    // })
  };

  // I want to use this for the future
  // const subtotal = lineItemList.reduce((total, currentItem) => total = parseInt(total) + parseInt(currentItem.amount), 0)
  // const total = lineItemList.reduce((total, currentItem) => total = parseInt(total) + parseInt(currentItem.amount), 0);

  return (
    <Drawer placement="right" onClose={onNewClose} isOpen={isNewOpen} size={'lg'}>
      <DrawerOverlay />
      <form method="POST" onSubmit={handleSubmit}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader shadow={'xs'}>New Invoice</DrawerHeader>
          <DrawerBody>
            {/* <Text fontSize={'25px'} fontWeight={'bold'} mb={'1rem'}>
                  Create
                  <Text as="span" ml={'8px'} color={'blue.400'}>
                    Invoice
                  </Text>
                </Text> */}
            <Flex gap={8} direction={{ base: 'column', lg: 'column' }}>
              {/* Invoice Details */}
              <Box>
                <Text fontSize={'md'} fontWeight={'bold'} color={'blue.500'} mt={'8px'} mb={'1rem'}>
                  Select a Customer
                </Text>
                <Box
                  w={'full'}
                  bg={useColorModeValue('gray.100', 'gray.600')}
                  border={'1px'}
                  borderColor={useColorModeValue('gray.200', 'gray.600')}
                  rounded={'xl'}>
                  {/* <FormLabel>Select Customer</FormLabel> */}
                  <FormControl isRequired>
                    <AsyncSelect
                      onChange={handleSelectedCustomer}
                      loadOptions={loadOptions}
                      // defaultOptions={}
                      placeholder="Search for Customer"
                      getOptionLabel={(option) => `${option.label},  ${option.email}`}
                      theme={(theme) => ({
                        ...theme,
                        borderRadius: 6,
                        colors: {
                          ...theme.colors,
                          primary25: colorMode === 'dark' ? '#4A5568' : '#EDF2F7',
                          primary: colorMode === 'dark' ? '#3182CE' : '#3182CE',
                          neutral0: colorMode === 'dark' ? '#1A202C' : 'white',
                          neutral90: 'white'
                        }
                      })}
                    />
                  </FormControl>
                </Box>
                {/* Bill To Input Fields */}
                {billToSwitchIsOn === true ? (
                  <>
                    <Text fontSize={'md'} fontWeight={'bold'} my={'1rem'} color={'blue.500'}>
                      Custom Bill Address
                    </Text>
                    <Box>
                      <FormLabel>Street Address</FormLabel>
                      <Input
                        value={billToStreetAddressInput}
                        onChange={(e) => setBillToStreetAddressInput(e.target.value)}
                        type={'text'}
                      />
                      <Flex flexDir={'row'} mb={'1rem'}>
                        <Flex flexDirection={'column'}>
                          <FormLabel pt="1rem">City</FormLabel>
                          <Input
                            value={billToCityInput}
                            onChange={(e) => setBillToCityInput(e.target.value)}
                            type={'text'}
                          />
                        </Flex>
                        <Flex flexDirection={'column'} ml={'1rem'}>
                          <FormLabel pt="1rem">State</FormLabel>
                          <Input
                            value={billToStateInput}
                            onChange={(e) => setBillToStateInput(e.target.value)}
                            type="text"
                          />
                        </Flex>
                        <Flex flexDirection={'column'} ml={'1rem'}>
                          <FormLabel mt="1rem">Zipcode</FormLabel>
                          <Input
                            value={billToZipcodeInput}
                            onChange={(e) => setBillToZipcodeInput(e.target.value)}
                            type={'text'}
                          />
                        </Flex>
                      </Flex>
                    </Box>
                  </>
                ) : (
                  <></>
                )}
                <Text
                  fontSize={'md'}
                  fontWeight={'bold'}
                  color={'blue.500'}
                  mt={'1rem'}
                  mb={'0rem'}>
                  Details
                </Text>
                <Flex gap={4} mt={'1rem'}>
                  <Box w={'50%'}>
                    <FormLabel>Invoice #</FormLabel>
                    <Input
                      placeholder={
                        !data
                          ? 'Loading...'
                          : Math.max(...data?.map((item) => item.invoice_number)) + 1
                      }
                      type={'number'}
                      value={invoiceNumberInput}
                      onChange={(e) => setInvoiceNumberInput(e.target.value)}
                    />
                  </Box>
                  <Box w={'50%'}>
                    <FormLabel>Status</FormLabel>
                    <Select
                      value={selectedInvoiceStatus}
                      placeholder="Select Status"
                      onChange={(e) => setSelectedInvoiceStatus(e.target.value)}>
                      <MultiPurposeOptions data={invoiceStatuses} />
                    </Select>
                  </Box>
                </Flex>
                <Flex gap={4} mt={'1rem'}>
                  <Box w={'50%'}>
                    <FormLabel>Invoice Date</FormLabel>
                    <Input
                      type="date"
                      value={invoiceDateInput}
                      onChange={({ target }) => setInvoiceDateInput(target.value)}
                      id="invDate"
                      placeholder="Select Invoice Date"
                    />
                  </Box>
                  <Box w={'50%'}>
                    <FormControl isRequired>
                      <FormLabel>Due Date</FormLabel>
                      <Input
                        type="date"
                        value={invoiceDueDateInput}
                        onChange={({ target }) => setInvoiceDueDateInput(target.value)}
                        id="dueDate"
                        placeholder="Due date"
                      />
                    </FormControl>
                  </Box>
                </Flex>
                <Box>
                  <FormLabel mt="1rem">Select Service</FormLabel>
                  <Select
                    value={selectedServiceType}
                    placeholder="Select Service"
                    onChange={(e) => setSelectedServiceType(e.target.value)}>
                    <MultiPurposeOptions data={services} />
                  </Select>
                </Box>
              </Box>
            </Flex>
            {/* Service Item Input Table */}
            <Text fontSize={'md'} fontWeight={'bold'} color={'blue.500'} mt={'2rem'} mb={'1rem'}>
              Line Items
            </Text>
            <Box>
              {/* <TableContainer>
                <Table variant={'unstyled'} size={'md'}>
                  <Thead>
                    <Tr>
                      <Th p={2}>Description</Th>
                      <Th p={2}>{fixedRateSwitchIsOn === true ? 'Qty' : 'Sqft'}</Th>
                      <Th p={2}>Rate</Th>
                      <Th p={2}>Amount</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {Array.from({ length: numOfLineItemFields }, (_, i) => (
                      <Tr key={i}>
                        <Td p={2}>
                          <Input
                            variant={'outline'}
                            placeholder={`Item ${i + 1}`}
                            name="description"
                            minW={'300px'}
                            onChange={(e) => handleOnChangeLineItemInput(e, i)}
                          />
                        </Td>
                        <Td p={2}>
                          {fixedRateSwitchIsOn === true ? (
                            <Input
                              type={'number'}
                              disabled
                              variant={'outline'}
                              placeholder="1"
                              name="qty"
                              maxW={'50px'}
                            />
                          ) : (
                            <Input
                              type={'number'}
                              minW={'10px'}
                              variant={'flushed'}
                              placeholder="30"
                              name="sq_ft"
                              onChange={(e) => handleOnChangeLineItemInput(e, i)}
                            />
                          )}
                        </Td>
                        <Td p={2}>
                          {fixedRateSwitchIsOn === true ? (
                            <Input
                              disabled
                              variant={'outline'}
                              placeholder={'Fixed'}
                              value={'Fixed'}
                              name="rate"
                              maxW={'100px'}
                              onChange={(e) => handleOnChangeLineItemInput(e, i)}
                            />
                          ) : (
                            <Input
                              minW={'80px'}
                              variant={'outline'}
                              name="rate"
                              placeholder="320"
                              maxW={'100px'}
                              onChange={(e) => handleOnChangeLineItemInput(e, i)}
                            />
                          )}
                        </Td>
                        <Td p={2}>
                          <Input
                            name="amount"
                            placeholder="0.00"
                            type={'number'}
                            onChange={(e) => handleOnChangeLineItemInput(e, i)}
                            maxW={'100px'}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer> */}
              {Array.from({ length: numOfLineItemFields }, (_, i) => (
                <Flex gap={4} w={'full'} key={i} px={4} py={4} rounded={'xl'}>
                  <Box w={'55%'}>
                    <FormControl isRequired>
                      <Input
                        px={2}
                        name="description"
                        placeholder="Enter item description"
                        onChange={(e) => handleOnChangeLineItemInput(e, i)}
                      />
                    </FormControl>
                  </Box>
                  <Box w={'10%'}>
                    <FormControl isRequired>
                      <Input
                        disabled
                        px={2}
                        name="qty"
                        value={1}
                        placeholder="Qty"
                        onChange={(e) => handleOnChangeLineItemInput(e, i)}
                      />
                    </FormControl>
                  </Box>
                  <Box w={'15%'}>
                    <FormControl isRequired>
                      <Input
                        disabled
                        px={2}
                        name="rate"
                        value={'Fixed'}
                        placeholder="Rate"
                        onChange={(e) => handleOnChangeLineItemInput(e, i)}
                      />
                    </FormControl>
                  </Box>
                  <Box w={'20%'}>
                    <FormControl isRequired>
                      <Input
                        name="amount"
                        type="number"
                        px={2}
                        placeholder="Amount"
                        onChange={(e) => handleOnChangeLineItemInput(e, i)}
                      />
                    </FormControl>
                  </Box>
                </Flex>
              ))}
            </Box>
            {/* Add Line Item Button */}
            <Flex justifyContent={'center'} gap={4}>
              <Button w={'30%'} onClick={() => handleAddingLineItem()} my={'1rem'}>
                Add Item
              </Button>
              {numOfLineItemFields <= 1 ? (
                <></>
              ) : (
                <Button my={'1rem'} onClick={() => handleDeleteLineItemField()}>
                  Delete Row
                </Button>
              )}
            </Flex>

            {/* Total */}
            {/* <Text fontSize={'lg'} fontWeight={'bold'} color={'blue.500'} mt={'2rem'} mb={'0rem'}>Total</Text> */}
            <Flex justify={'space-between'} px={'8rem'} py={'2rem'}>
              <Text>Subtotal</Text>
              <Text>${formatMoneyValue(invoiceSubTotalCalculatedvalue)}</Text>
            </Flex>
            <Flex
              justify={'space-between'}
              mx={'2rem'}
              px={'2rem'}
              py={'3'}
              bg={tableHeaderColor}
              rounded={'xl'}
              color={'white'}>
              <Text fontSize={'xl'} fontWeight={'bold'}>
                Total
              </Text>
              <Text fontSize={'xl'} fontWeight={'bold'}>
                ${formatMoneyValue(invoiceTotalCalculatedValue)}
              </Text>
            </Flex>

            {/* Extra Section Information */}
            {measurementNoteSwitchIsOn === true ||
            noteSwitchIsOn === true ||
            customerNoteSwitchIsOn === true ? (
              <>
                <Text
                  fontSize={'md'}
                  fontWeight={'bold'}
                  color={'blue.500'}
                  mt={'4rem'}
                  mb={'0rem'}>
                  Additional Information
                </Text>
              </>
            ) : (
              <></>
            )}
            <Flex direction={{ base: 'column', lg: 'row' }} w={'full'} gap={4}>
              {noteSwitchIsOn === true ? (
                <>
                  <Box w={{ base: 'full', lg: '50%' }}>
                    <FormControl>
                      <FormLabel mt="1rem">General Note</FormLabel>
                      <Textarea
                        height={'200px'}
                        value={noteInput}
                        onChange={(e) => setNoteInput(e.target.value)}
                        placeholder="Enter information regarding the customer on their wants, needs, or concenrs that they might have. Or for internal status updates. 👋"
                      />
                    </FormControl>
                  </Box>
                </>
              ) : (
                <></>
              )}
              {measurementNoteSwitchIsOn === true ? (
                <>
                  <Box w={{ base: 'full', lg: '50%' }}>
                    <FormControl>
                      <FormLabel mt={'1rem'}>Measurements Note</FormLabel>
                      <Textarea
                        height={'200px'}
                        value={sqftInput}
                        onChange={(e) => setSqftInput(e.target.value)}
                        placeholder="Enter roof measurments or any metrics to remember for future reference. 📏"
                      />
                    </FormControl>
                  </Box>
                </>
              ) : (
                <></>
              )}
            </Flex>
            {customerNoteSwitchIsOn === true ? (
              <>
                <Box>
                  <FormControl>
                    <FormLabel mt={'2rem'}>Message to Customer</FormLabel>
                    <Textarea
                      placeholder="Thank you for your business! 🚀"
                      value={customerNoteMessage}
                      onChange={(e) => setCustomerNoteMessage(e.target.value)}
                    />
                  </FormControl>
                </Box>
              </>
            ) : (
              <></>
            )}
            {/* Custom Setting Switches */}
            <Text fontSize={'md'} fontWeight={'bold'} color={'blue.500'} mt={'2rem'} mb={'1rem'}>
              Optional Fields
            </Text>
            <Flex w={'full'} gap={4}>
              {/* Switch 1 */}
              <Flex
                justify={'center'}
                direction={'column'}
                w={'50%'}
                border={'1px'}
                borderColor={useColorModeValue('gray.200', 'gray.600')}
                rounded={'xl'}>
                <Flex w={'full'} justify={'space-between'}>
                  <Flex ml={'1rem'} gap={4}>
                    <Box my={'auto'}>
                      <TbNote size={'20px'} />
                    </Box>
                    <Box>
                      <Text fontSize={'sm'} fontWeight={'bold'}>
                        General Note
                      </Text>
                      <Text fontSize={'xs'} fontWeight={'normal'}>
                        To jot down general info
                      </Text>
                    </Box>
                  </Flex>
                  <Box mr={'1rem'} my={'auto'}>
                    <Switch
                      isChecked={noteSwitchIsOn}
                      onChange={() => setNoteSwitchIsOn(!noteSwitchIsOn)}
                    />
                  </Box>
                </Flex>
              </Flex>
              {/* Switch 2 */}
              <Flex
                justify={'center'}
                direction={'column'}
                w={'50%'}
                h={'80px'}
                border={'1px'}
                borderColor={useColorModeValue('gray.200', 'gray.600')}
                rounded={'xl'}>
                <Flex w={'full'} justify={'space-between'}>
                  <Flex ml={'1rem'} gap={4}>
                    <Box my={'auto'}>
                      <TbRuler size={'20px'} />
                    </Box>
                    <Box>
                      <Text fontSize={'sm'} fontWeight={'bold'}>
                        Measurements Note
                      </Text>
                      <Text fontSize={'xs'} fontWeight={'normal'}>
                        To write roof measurements
                      </Text>
                    </Box>
                  </Flex>
                  <Box mr={'1rem'} my={'auto'}>
                    <Switch
                      isChecked={measurementNoteSwitchIsOn}
                      onChange={() => setMeasurementNoteSwitchIsOn(!measurementNoteSwitchIsOn)}
                    />
                  </Box>
                </Flex>
              </Flex>
            </Flex>
            <Flex w={'full'} gap={4} mt={'1rem'} mb={'8px'}>
              {/* Switch 3 */}
              <Flex
                justify={'center'}
                direction={'column'}
                w={'50%'}
                h={'80px'}
                border={'1px'}
                borderColor={useColorModeValue('gray.200', 'gray.600')}
                rounded={'xl'}>
                <Flex w={'full'} justify={'space-between'}>
                  <Flex ml={'1rem'} gap={4}>
                    <Box my={'auto'}>
                      <FiMap size={'20px'} />
                    </Box>
                    <Box>
                      <Text fontSize={'sm'} fontWeight={'bold'}>
                        Custom Address
                      </Text>
                      <Text fontSize={'xs'} fontWeight={'normal'}>
                        Manual input for address
                      </Text>
                    </Box>
                  </Flex>
                  <Box mr={'1rem'} my={'auto'}>
                    <Switch
                      isChecked={billToSwitchIsOn}
                      onChange={() => setBillToSwitchIsOn(!billToSwitchIsOn)}
                    />
                  </Box>
                </Flex>
              </Flex>
              {/* Switch 4 */}
              <Flex
                justify={'center'}
                direction={'column'}
                w={'50%'}
                h={'80px'}
                border={'1px'}
                borderColor={useColorModeValue('gray.200', 'gray.600')}
                rounded={'xl'}>
                <Flex w={'full'} justify={'space-between'}>
                  <Flex ml={'1rem'} gap={4}>
                    <Box my={'auto'}>
                      <FiUser size={'20px'} />
                    </Box>
                    <Box>
                      <Text fontSize={'sm'} fontWeight={'bold'}>
                        Customer Message
                      </Text>
                      <Text fontSize={'xs'} fontWeight={'normal'}>
                        Write message to customer
                      </Text>
                    </Box>
                  </Flex>
                  <Box mr={'1rem'} my={'auto'}>
                    <Switch
                      isChecked={customerNoteSwitchIsOn}
                      onChange={() => setCustomerNoteSwitchIsOn(!customerNoteSwitchIsOn)}
                    />
                  </Box>
                </Flex>
              </Flex>
            </Flex>
          </DrawerBody>
          <DrawerFooter gap={4}>
            <Button colorScheme="blue" type="submit" isLoading={loadingState}>
              Create Invoice
            </Button>
            <Button onClick={handleCancelButton}>Cancel</Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
};

export default NewInvoiceForm;
