import React, { useState } from 'react';
import { DrawerIndex, MultiPurposeOptions } from '../../../components';
import { supabase } from '../../../utils';
import AsyncSelect from 'react-select/async';
import {
  useColorMode,
  Select,
  Flex,
  Textarea,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Box,
  Switch,
  useColorModeValue
} from '@chakra-ui/react';
import { FiMap, FiUser } from 'react-icons/fi';
import { TbNote, TbRuler } from 'react-icons/tb';

const CreateQuoteForm = (props) => {
  const { isOpen, onClose, initialRef, updateParentState, services, quoteStatuses, toast } = props;

  // React hooks
  //   const { services } = useServices();
  //   const { quoteStatuses } = useQuoteStatuses();

  // React styling hooks
  const { colorMode } = useColorMode();

  // States to manage data
  // const [estimates, setEstimates] = useState(null);
  // const [customers, setCustomers] = useState('');
  // const [name, setCustomerName] = useState('');

  // const [serviceName, setServiceName] = useState('');
  // const [cuIdCaptured, setCuIdCaptured] = useState('');

  // const [quoteToStreetAddressInput, setQuoteToStreetAddressInput] = useState('');
  // const [quoteToCityInput, setQuoteToCityInput] = useState('');
  // const [quoteToStateInput, setQuoteToStateInput] = useState('');
  // const [quoteToZipcodeInput, setQuoteToZipcodeInput] = useState('');

  // React usestates to capture data from inputs from form
  const [quoteNumberInput, setQuoteNumberInput] = useState('');
  const [quoteStatusInput, setQuoteStatusInput] = useState('');
  const [selectedCustomerInput, setSelectedCustomerInput] = useState('');
  const [selectedQuoteServiceInput, setSelectedQuoteServiceInput] = useState('');
  const [quoteDateInput, setQuoteDateInput] = useState('');
  const [expirationDateInput, setExpirationDateInput] = useState('');
  const [quoteTotalInput, setQuoteTotalInput] = useState('');
  const [measurementNoteInput, setMeasurementNoteInput] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [customerMessageInput, setCustomerMessageInput] = useState('');
  const [customStreetAddressInput, setCustomStreetAddressInput] = useState('');
  const [customCityInput, setCustomCityInput] = useState('');
  const [customStateInput, setCustomStateInput] = useState('');
  const [customZipcodeInput, setCustomZipcodeInput] = useState('');

  // React useStates to use boolean values such as switches
  const [noteSwitchIsOn, setNoteSwitchIsOn] = useState(false);
  const [measurementsNoteSwitchIsOn, setMeasurementsNoteSwitchIsOn] = useState(false);
  const [customerMessageSwitchIsOn, setCustomerMessageSwitchIsOn] = useState(false);
  const [customAddressSwitchIsOn, setCustomAddressSwitchIsOn] = useState(false);

  ///////////////////// Functions that will load options for react-select component as the user types a value /////////////////////////
  const loadOptions = async (inputText, callback) => {
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
      customers.map((customer, index) => ({
        label: `${customer.first_name} ${customer.last_name}`,
        value: customer.id,
        email: customer.email
      }))
    );
    // console.log(customers)
  };

  const handleSelectedCustomer = (value) => {
    setSelectedCustomerInput({
      selectedCustomer: value || []
    });
    // console.log(selectedCustomer.selectedCustomer.value);
  };

  ///////////////////// Functions that handle submit functionality for new data being inputed ////////////////////////////
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from('quote').insert({
      quote_number: quoteNumberInput,
      customer_id: selectedCustomerInput.selectedCustomer.value,
      status_id: quoteStatusInput,
      service_id: selectedQuoteServiceInput,
      quote_date: quoteDateInput,
      expiration_date: expirationDateInput,
      subtotal: quoteTotalInput,
      total: quoteTotalInput,
      note: noteInput ? noteInput : null,
      measurement_note: measurementNoteInput ? measurementNoteInput : null,
      cust_note: customerMessageInput
        ? customerMessageInput
        : "If you have any questions or concerns don't hesitate to reach us. 👋",
      custom_street_address: customStreetAddressInput ? customStreetAddressInput : null,
      custom_city: customCityInput ? customCityInput : null,
      custom_state: customStateInput ? customStateInput : null,
      custom_zipcode: customZipcodeInput ? customZipcodeInput : null
    });

    if (error) {
      toast({
        position: 'top',
        title: `Error Creating Quote`,
        description: `Error: ${error.message} 🚨`,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
    if (data) {
      await updateParentState();
      onClose();
      toast({
        position: 'top',
        title: `Successfully Created Quote!`,
        description: `We've created a quote for customer number #${selectedCustomerInput.selectedCustomer.value} 🎉`,
        status: 'success',
        duration: 5000,
        isClosable: true
      });
      console.log('Data submitted successfully!');
    }

    setQuoteNumberInput('');
    setQuoteStatusInput('');
    setSelectedCustomerInput('');
    setSelectedQuoteServiceInput('');
    setQuoteDateInput('');
    setExpirationDateInput('');
    setQuoteTotalInput('');
    setMeasurementNoteInput('');
    setNoteInput('');
    setCustomerMessageInput('');
    setCustomStreetAddressInput('');
    setCustomCityInput('');
    setCustomStateInput('');
    setCustomZipcodeInput('');

    setNoteSwitchIsOn(false);
    setMeasurementsNoteSwitchIsOn(false);
    setCustomerMessageSwitchIsOn(false);
    setCustomAddressSwitchIsOn(false);
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement="right" size={'lg'}>
      <DrawerOverlay />
      <form method="POST" onSubmit={handleSubmit}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader shadow={'xs'}>New Quote</DrawerHeader>
          <DrawerBody>
            {/* <Text fontSize={'25px'} fontWeight={'bold'}>
              Create
              <Text as="span" ml={'8px'} color={'blue.500'}>
                Quote
              </Text>
            </Text> */}
            <Text fontWeight={'bold'} color={'blue.500'} mt={'8px'} mb={'1rem'}>
              Select Customer
            </Text>
            {/* <FormLabel pt="1rem">Select a Customer</FormLabel> */}
            <AsyncSelect
              ref={initialRef}
              onChange={handleSelectedCustomer}
              loadOptions={loadOptions}
              isRequired
              // defaultOptions={}
              placeholder="Type Customer Name"
              getOptionLabel={(option) => `${option.label},  ${option.email}`}
              theme={(theme) => ({
                ...theme,
                borderRadius: 6,
                colors: {
                  ...theme.colors,
                  primary25: colorMode === 'dark' ? '#4A5568' : '#EDF2F7',
                  primary: '#3182CE',
                  neutral0: colorMode === 'dark' ? '#2D3748' : 'white',
                  neutral90: 'white'
                }
              })}
            />
            {customAddressSwitchIsOn === false ? (
              <></>
            ) : (
              <>
                <Text fontWeight={'bold'} color={'blue.500'} mt={'1rem'} mb={'1rem'}>
                  Custom Address
                </Text>
                <Box mb={'1rem'}>
                  <FormControl>
                    <FormLabel>Street Address</FormLabel>
                    <Input
                      placeholder="Street Address"
                      value={customStreetAddressInput}
                      onChange={({ target }) => setCustomStreetAddressInput(target.value)}
                    />
                  </FormControl>
                </Box>
                <Flex gap={4}>
                  <Box>
                    <FormControl>
                      <FormLabel>City</FormLabel>
                      <Input
                        placeholder="City"
                        value={customCityInput}
                        onChange={({ target }) => setCustomCityInput(target.value)}
                      />
                    </FormControl>
                  </Box>
                  <Box>
                    <FormControl>
                      <FormLabel>State</FormLabel>
                      <Input
                        placeholder="State"
                        value={customStateInput}
                        onChange={({ target }) => setCustomStateInput(target.value)}
                      />
                    </FormControl>
                  </Box>
                  <Box>
                    <FormControl>
                      <FormLabel>Zipcode</FormLabel>
                      <Input
                        placeholder="Zipcode"
                        value={customZipcodeInput}
                        onChange={({ target }) => setCustomZipcodeInput(target.value)}
                      />
                    </FormControl>
                  </Box>
                </Flex>
              </>
            )}

            {/* <FormLabel mt="1rem">Street Address</FormLabel>
              <Input
                value={quoteToStreetAddressInput}
                onChange={(e) => setQuoteToStreetAddressInput(e.target.value)}
                type={'text'}
              />
              <Flex flexDir={'row'} mb={'1rem'}>
                <Flex flexDirection={'column'}>
                  <FormLabel pt="1rem">City</FormLabel>
                  <Input
                    value={quoteToCityInput}
                    onChange={(e) => setQuoteToCityInput(e.target.value)}
                    type={'text'}
                  />
                </Flex>
                <Flex flexDirection={'column'} ml={'1rem'}>
                  <FormLabel pt="1rem">State</FormLabel>
                  <Input
                    value={quoteToStateInput}
                    onChange={(e) => setQuoteToStateInput(e.target.value)}
                    type="text"
                  />
                </Flex>
              </Flex>
              <FormLabel mt="1rem">Zipcode</FormLabel>
              <Input
                value={quoteToZipcodeInput}
                onChange={(e) => setQuoteToZipcodeInput(e.target.value)}
                type={'text'}
              /> */}
            <Text fontWeight={'bold'} color={'blue.500'} mt={'1rem'} mb={'1rem'}>
              Details
            </Text>
            <Flex w={'full'} gap={4}>
              <Box w={'50%'}>
                <FormControl isRequired>
                  <FormLabel>Quote Number</FormLabel>
                  <Input
                    type={'number'}
                    placeholder="Type Quote Number"
                    value={quoteNumberInput}
                    onChange={(e) => setQuoteNumberInput(e.target.value)}
                  />
                </FormControl>
              </Box>
              <Box w={'50%'}>
                <FormControl isRequired>
                  <FormLabel>Status</FormLabel>
                  <Select
                    placeholder="Select Status"
                    value={quoteStatusInput}
                    onChange={(e) => setQuoteStatusInput(e.target.value)}>
                    <MultiPurposeOptions data={quoteStatuses} />
                  </Select>
                </FormControl>
              </Box>
            </Flex>
            <Flex w={'full'} gap={4}>
              <Box w={'50%'}>
                <FormControl isRequired>
                  <FormLabel pt="1rem">Quote Date</FormLabel>
                  <Input
                    type="date"
                    value={quoteDateInput}
                    onChange={({ target }) => setQuoteDateInput(target.value)}
                    placeholder="Quote date"
                  />
                </FormControl>
              </Box>
              <Box w={'50%'}>
                <FormControl isRequired>
                  <FormLabel pt="1rem">Expiration Date</FormLabel>
                  <Input
                    type="date"
                    value={expirationDateInput}
                    onChange={({ target }) => setExpirationDateInput(target.value)}
                    placeholder="Expiration Date"
                  />
                </FormControl>
              </Box>
            </Flex>
            {/* <Input value={city} onChange={({target}) => setCity(target.value)} id='city' placeholder='City'/> */}
            <FormControl isRequired>
              <FormLabel pt="1rem">Select Service</FormLabel>
              <Select
                value={selectedQuoteServiceInput}
                placeholder="Select a Service"
                onChange={(e) => setSelectedQuoteServiceInput(e.target.value)}>
                <MultiPurposeOptions data={services} />
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel pt="1rem">Total</FormLabel>
              <Input
                value={quoteTotalInput}
                onChange={({ target }) => setQuoteTotalInput(target.value)}
                placeholder="Quote price"
                type="number"
              />
            </FormControl>
            {customerMessageSwitchIsOn === false &&
            noteSwitchIsOn === false &&
            measurementsNoteSwitchIsOn === false ? (
              <></>
            ) : (
              <>
                <Text fontWeight={'bold'} color={'blue.500'} mt={'2rem'} mb={'1rem'}>
                  Additional Information
                </Text>
              </>
            )}
            <Flex w={'full'} gap={4}>
              {noteSwitchIsOn === false ? (
                <></>
              ) : (
                <>
                  <Box w={'50%'}>
                    <FormControl>
                      <FormLabel>General Note</FormLabel>
                      <Textarea
                        height={'200px'}
                        placeholder="Enter info regarding the customer on their wants, needs, or concenrs that they might have. Or for internal status updates. 👋"
                        value={noteInput}
                        onChange={({ target }) => setNoteInput(target.value)}></Textarea>
                    </FormControl>
                  </Box>
                </>
              )}
              {measurementsNoteSwitchIsOn === false ? (
                <></>
              ) : (
                <>
                  <Box w={'50%'}>
                    <FormControl>
                      <FormLabel>Measurements Note</FormLabel>
                      <Textarea
                        height={'200px'}
                        placeholder="Enter roof measurments or any metrics to remember for future reference. 📏"
                        value={measurementNoteInput}
                        onChange={({ target }) => setMeasurementNoteInput(target.value)}></Textarea>
                    </FormControl>
                  </Box>
                </>
              )}
            </Flex>
            {customerMessageSwitchIsOn === false ? (
              <></>
            ) : (
              <>
                <Flex w={'full'}>
                  <FormControl>
                    <FormLabel pt="1rem">Message to Customer</FormLabel>
                    <Textarea
                      value={customerMessageInput}
                      placeholder="Enter message to customer to see when we send this quote to them 🎉"
                      onChange={({ target }) => setCustomerMessageInput(target.value)}
                    />
                  </FormControl>
                </Flex>
              </>
            )}

            <Text fontWeight={'bold'} color={'blue.500'} mt={'2rem'} mb={'1rem'}>
              Custom Fields
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
                      isChecked={measurementsNoteSwitchIsOn}
                      onChange={() => setMeasurementsNoteSwitchIsOn(!measurementsNoteSwitchIsOn)}
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
                      isChecked={customAddressSwitchIsOn}
                      onChange={() => setCustomAddressSwitchIsOn(!customAddressSwitchIsOn)}
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
                      isChecked={customerMessageSwitchIsOn}
                      onChange={() => setCustomerMessageSwitchIsOn(!customerMessageSwitchIsOn)}
                    />
                  </Box>
                </Flex>
              </Flex>
            </Flex>
          </DrawerBody>
          <DrawerFooter gap={4}>
            <Button colorScheme="blue" type="submit">
              Create Quote
            </Button>
            <Button onClick={onClose} mr="1rem">
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
};

export default CreateQuoteForm;
