import React, { useState, useEffect } from 'react';
import { StateOptions, MultiPurposeOptions } from '../..';
import { formatPhoneNumber } from '../../../utils';
import stateJSONData from '../../../data/state_titlecase.json';
import {
  Select,
  Input,
  InputGroup,
  InputLeftAddon,
  FormControl,
  FormLabel,
  Flex,
  Button,
  Text,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter
} from '@chakra-ui/react';
import { useCreateCustomer } from '../../../hooks/useAPI/useCustomers';

const NewCustomerForm = (props) => {
  const { isOpen, onClose, initialRef, toast, customerTypes } = props;

  useEffect(() => {
    setstates(stateJSONData);
  }, []);

  // useStates that pick up the values from the input fields of the form
  const [firstName, setfirstName] = useState('');
  const [lastName, setlastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [email, setEmail] = useState('');
  // const [customerTypes, setcustomerTypes] = useState('');
  const [selectedCustomerType, setselectedCustomerType] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [states, setstates] = useState('');

  const [inputValue, SetInputValue] = useState('');

  const newCustomerObject = {
    first_name: firstName,
    last_name: lastName,
    street_address: address,
    city: city,
    state: selectedState,
    zipcode: zipcode,
    phone_number: inputValue,
    email: email,
    customer_type_id: selectedCustomerType
  };

  const handleResettingUseState = () => {
    setfirstName('');
    setlastName('');
    setAddress('');
    setCity('');
    setZipcode('');
    SetInputValue('');
    setEmail('');
    setselectedCustomerType('');
    setSelectedState('');
    onClose();
  };

  // Custom hook to create a new customer
  const { mutate, isLoading } = useCreateCustomer(toast, handleResettingUseState);

  const handleSubmit = async (event) => {
    event.preventDefault();
    mutate(newCustomerObject);
  };

  // Handles the phone number input formating
  const handlePhoneInput = (e) => {
    //This is where we'll call our future formatPhoneNumber function
    const formattedPhoneNumber = formatPhoneNumber(e.target.value);
    //We'll set the input value using our setInputValue
    SetInputValue(formattedPhoneNumber);
  };

  return (
    <Drawer
      placement="right"
      onClose={onClose}
      isOpen={isOpen}
      size={{ base: 'full', md: 'lg' }}
      initialFocusRef={initialRef}>
      <DrawerOverlay />
      <form method="POST" onSubmit={handleSubmit}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Add Customer</DrawerHeader>
          <DrawerBody>
            {/* <Text fontSize={'25px'} fontWeight={'bold'}>
              Create
              <Text as="span" ml={'8px'} color={'blue.500'}>
                Customer
              </Text>
            </Text> */}
            <Text fontWeight={'bold'} color={'blue.500'} mt={'0rem'} mb={'0rem'}>
              Description
            </Text>
            <FormControl isRequired>
              <FormLabel pt="1rem">Customer Type</FormLabel>
              <Select
                ref={initialRef}
                value={selectedCustomerType}
                placeholder="Select Customer Type"
                onChange={(e) => {
                  setselectedCustomerType(e.target.value);
                }}>
                <MultiPurposeOptions data={customerTypes} />
              </Select>
            </FormControl>
            <Flex>
              <FormControl isRequired mr={'1rem'}>
                <FormLabel pt="1rem">First Name</FormLabel>
                <Input
                  value={firstName}
                  onChange={({ target }) => setfirstName(target.value)}
                  id="name"
                  placeholder="First Name"
                />
              </FormControl>
              <FormControl isRequired ml={'1rem'}>
                <FormLabel pt="1rem">Last Name</FormLabel>
                <Input
                  value={lastName}
                  onChange={({ target }) => setlastName(target.value)}
                  id="name"
                  placeholder="Last Name"
                />
              </FormControl>
            </Flex>
            <FormControl isRequired>
              <FormLabel pt="1rem">Email</FormLabel>
              <Input
                value={email}
                onChange={({ target }) => setEmail(target.value)}
                placeholder="Email Address"
                type="email"
              />
            </FormControl>
            <FormControl isRequired>
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
            <Text fontWeight={'bold'} color={'blue.500'} mt={'2rem'} mb={'0rem'}>
              Location
            </Text>
            <FormControl isRequired>
              <FormLabel pt="1rem">Street Address</FormLabel>
              <Input
                value={address}
                onChange={({ target }) => setAddress(target.value)}
                id="address"
                placeholder="Street address"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel pt="1rem">City</FormLabel>
              <Input
                value={city}
                onChange={({ target }) => setCity(target.value)}
                id="city"
                placeholder="City"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel pt="1rem">State</FormLabel>
              {/* <Input value={state} onChange={({target}) => setState(target.value)} id='state' placeholder='State'/> */}
              <Select
                value={selectedState}
                placeholder="Select State"
                onChange={(e) => {
                  setSelectedState(e.target.value);
                }}>
                <StateOptions states={states} />
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel pt="1rem">Zipcode</FormLabel>
              <Input
                value={zipcode}
                onChange={({ target }) => setZipcode(target.value)}
                id="zipcode"
                placeholder="Zipcode"
              />
            </FormControl>
            <Flex pt={'2rem'} w="full" justifyContent={'flex-end'}></Flex>
          </DrawerBody>
          <DrawerFooter gap={4}>
            <Button colorScheme={'blue'} type="submit" isLoading={isLoading}>
              Add customer
            </Button>
            <Button onClick={onClose} mr={'1rem'}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
};

export default NewCustomerForm;
