import React, { useState, useEffect } from 'react';
import { MultiPurposeOptions, StateOptions } from '../..';
import {
  Text,
  FormControl,
  FormLabel,
  Select,
  Input,
  InputGroup,
  Button,
  Flex,
  DrawerFooter,
  InputLeftAddon,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody
} from '@chakra-ui/react';
import { formatPhoneNumber } from '../../../utils';
import stateJSONData from '../../../data/state_titlecase.json';
import { useCreateNewQuoteRequest } from '../../../hooks/useAPI/useQuoteRequests';

const NewEstimateRequestForm = (props) => {
  const { isOpen, onOpen, onClose, initialRef, toast, services, qrStatuses, customerTypes } = props;
  const { mutate, isLoading } = useCreateNewQuoteRequest(toast);

  //React useStates for capturing data from input fields
  const [selectedQuoteStatus, setSelectedQuoteStatus] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedCustomerType, setSelectedCustomerType] = useState('');
  const [selectedQuoteDate, setSelectedQuoteDate] = useState('');
  const [states, setStates] = useState(null);
  const [selectedState, setSelectedState] = useState('');
  const [qrStreetAddress, setQrStreetAddress] = useState('');
  const [qrCity, setQrCity] = useState('');
  const [qrPostalCode, setQrPostalCode] = useState('');
  const [qrClientFirstName, setQrClientFirstName] = useState('');
  const [qrClientLastname, setQrClientLastname] = useState('');
  const [qrClientEmail, setQrClientEmail] = useState('');
  // const [qrDate, setQrDate] = useState('');
  // const [qrState, setQrState] = useState('');

  // React useState for phone number input
  const [inputValue, SetInputValue] = useState('');

  useEffect(() => {
    setStates(stateJSONData);
  }, []);

  //Function that gets the data from the fields from form and submits them to DB
  const handleSubmit = async (event) => {
    event.preventDefault();
    const newQuoteRequestObject = {
      est_request_status_id: selectedQuoteStatus,
      service_type_id: selectedService,
      requested_date: selectedQuoteDate,
      firstName: qrClientFirstName,
      lastName: qrClientLastname,
      streetAddress: qrStreetAddress,
      city: qrCity,
      state: selectedState,
      zipcode: qrPostalCode,
      customer_typeID: selectedCustomerType,
      phone_number: inputValue,
      email: qrClientEmail
    };
    mutate(newQuoteRequestObject);

    // Closes drawer
    onClose();

    // Set useState back to empty values
    setSelectedQuoteDate('');
    setSelectedService('');
    setSelectedQuoteStatus('');
    setQrCity('');
    setQrClientEmail('');
    setQrClientFirstName('');
    setQrClientLastname('');
    setQrPostalCode('');
    setQrStreetAddress('');
    setSelectedState('');
    SetInputValue('');
    setSelectedCustomerType('');
  };

  //Clear values when cancel button is presses
  const handleCancel = async () => {
    setSelectedQuoteDate('');
    setSelectedService('');
    setSelectedQuoteStatus('');
    setQrCity('');
    setQrClientEmail('');
    setQrClientFirstName('');
    setQrClientLastname('');
    setQrPostalCode('');
    setQrStreetAddress('');
    setSelectedState('');
    SetInputValue('');
    setSelectedCustomerType('');
    // setQrDate('');
    // setQrState('');
    onClose();
  };

  //Formats phone number input from user
  const handlePhoneInput = (e) => {
    //This is where we'll call our future formatPhoneNumber function
    const formattedPhoneNumber = formatPhoneNumber(e.target.value);
    //We'll set the input value using our setInputValue
    SetInputValue(formattedPhoneNumber);
  };

  return (
    <Drawer placement="right" onClose={onClose} isOpen={isOpen} size={'lg'}>
      <DrawerOverlay />
      <form method="POST" onSubmit={handleSubmit}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader shadow={'xs'}>New Quote Request</DrawerHeader>
          <DrawerBody>
            {/* <Text fontSize={'25px'} fontWeight={'bold'}>
              Create
              <Text as="span" ml={'8px'} color={'blue.500'}>
                Quote Request
              </Text>
            </Text> */}
            <Text fontWeight={'bold'} color={'blue.500'} mt={'0rem'} mb={'1rem'}>
              Request
            </Text>
            <FormControl isRequired>
              <Flex>
                <Flex flexDir={'column'}>
                  <FormLabel>Status</FormLabel>
                  <Select
                    placeholder="Select Status"
                    value={selectedQuoteStatus}
                    onChange={(e) => {
                      setSelectedQuoteStatus(e.target.value);
                    }}>
                    <MultiPurposeOptions data={qrStatuses} />
                  </Select>
                </Flex>
                <Flex flexDir={'column'} ml={'1rem'}>
                  <FormLabel>Desired Date</FormLabel>
                  <Input
                    type={'date'}
                    value={selectedQuoteDate}
                    onChange={(e) => setSelectedQuoteDate(e.target.value)}
                  />
                </Flex>
              </Flex>
              <FormLabel mt={'1rem'}>Customer Type</FormLabel>
              <Select
                placeholder="Select Customer Type"
                value={selectedCustomerType}
                onChange={(e) => {
                  setSelectedCustomerType(e.target.value);
                }}>
                <MultiPurposeOptions data={customerTypes} />
              </Select>
              <FormLabel mt={'1rem'}>Service Type</FormLabel>
              <Select
                placeholder="Select Service"
                value={selectedService}
                onChange={(e) => {
                  setSelectedService(e.target.value);
                }}>
                <MultiPurposeOptions data={services} />
              </Select>
              {/* <Input type={'text'}/> */}
              <Text fontWeight={'bold'} color={'blue.500'} mt={'2rem'} mb={'1rem'}>
                Address
              </Text>
              <FormLabel>Street Address</FormLabel>
              <Input
                value={qrStreetAddress}
                onChange={({ target }) => setQrStreetAddress(target.value)}
              />
              <Flex mt={'1rem'}>
                <Flex flexDir={'column'} mr={'1rem'}>
                  <FormLabel>City</FormLabel>
                  <Input
                    type={'text'}
                    value={qrCity}
                    onChange={({ target }) => setQrCity(target.value)}
                  />
                </Flex>
                <Flex flexDir={'column'}>
                  <FormLabel>State</FormLabel>
                  {/* <Input type={'text'} value={qrState} onChange={({target}) => setQrState(target.value)}/> */}
                  <Select
                    value={selectedState}
                    onChange={(e) => {
                      setSelectedState(e.target.value);
                    }}
                    placeholder={'Select State'}>
                    <StateOptions states={states} />
                  </Select>
                </Flex>
                <Flex flexDir={'column'} ml={'1rem'}>
                  <FormLabel>Zipcode</FormLabel>
                  <Input
                    type={'text'}
                    value={qrPostalCode}
                    onChange={({ target }) => setQrPostalCode(target.value)}
                  />
                </Flex>
              </Flex>

              <Text fontWeight={'bold'} color={'blue.500'} mt={'2rem'} mb={'1rem'}>
                Client
              </Text>
              <Flex mt={'1rem'}>
                <Flex flexDir={'column'} mr={'1rem'}>
                  <FormLabel>First Name</FormLabel>
                  <Input
                    type={'text'}
                    value={qrClientFirstName}
                    onChange={({ target }) => setQrClientFirstName(target.value)}
                  />
                </Flex>
                <Flex flexDir={'column'}>
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    type={'text'}
                    value={qrClientLastname}
                    onChange={({ target }) => setQrClientLastname(target.value)}
                  />
                </Flex>
              </Flex>
              <FormLabel mt={'1rem'}>Email</FormLabel>
              <Input
                type={'email'}
                value={qrClientEmail}
                onChange={({ target }) => setQrClientEmail(target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel pt="1rem">Phone Number</FormLabel>
              <InputGroup>
                <InputLeftAddon children="+1" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Phone number"
                  onChange={(e) => handlePhoneInput(e)}
                  value={inputValue}
                />
              </InputGroup>
            </FormControl>
          </DrawerBody>
          <DrawerFooter gap={4}>
            <Button type="submit" colorScheme={'blue'} isLoading={isLoading}>
              Create QR
            </Button>
            <Button onClick={handleCancel} mr="1rem">
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
};

export default NewEstimateRequestForm;
