import React, { useState, useEffect } from 'react';
import { DrawerIndex, MultiPurposeOptions } from '../../../components';
import {
  Flex,
  FormControl,
  FormLabel,
  Button,
  Input,
  FormHelperText,
  Text,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Select
} from '@chakra-ui/react';
import { formatPhoneNumber, supabase } from '../../../utils';

const EditCustomerForm = (props) => {
  const {
    isOpen,
    onOpen,
    onClose,
    initialRef,
    customer,
    updateParentState,
    toast,
    handleEditOnChange,
    handleEditSubmit,
    customerTypes
  } = props;

  // States that pick up the values from the input fields of the form
  const [name, setCustomerName] = useState('');
  const [firstName, setfirstName] = useState('');
  const [lastName, setlastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [email, setEmail] = useState('');
  const [selectField, setSelectField] = useState('');
  const [phoneInputValue, setPhoneInputValue] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    // const url2 = `http://${process.env.REACT_APP_BASE_URL}:8081/api/customers/${id}`
    const json = {
      name: name,
      address: address,
      city: city,
      state: state,
      zipcode: zipcode,
      phone_number: !phoneInputValue ? customer?.phone_number : phoneInputValue,
      email: email
    };
    console.log('Submit Function works!');

    // getAllCustomer();
    updateParentState();
    toast();
    setAddress('');
    setCity('');
    setZipcode('');
    setPhoneInputValue('');
    setEmail('');
    setSelectField('');
    setState('');
    setfirstName('');
    setlastName('');
    setlastName('');
    onClose();
  };

  const handlePhoneInput = (e) => {
    //This is where we'll call our future formatPhoneNumber function
    const formattedPhoneNumber = formatPhoneNumber(e.target.value);
    console.log(formattedPhoneNumber);
    //We'll set the input value using our setInputValue
    setPhoneInputValue(formattedPhoneNumber);
  };

  const handleEditSubmit1 = async (event) => {
    event.preventDefault();
    const { data, error } = await supabase
      .from('customer')
      .update({
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone_number: phoneInputValue,
        street_address: address,
        city: city,
        state: state,
        zipcode: zipcode
      })
      .match({ id: customer?.id });

    if (error) {
      console.log(error);
      // Feedback toast error has occured editing customer data
      toast({
        position: 'top',
        title: `Error Occurred Updating Customer!`,
        description: `Error: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }

    if (data) {
      await updateParentState();

      // Feedback toast when customer has been updated succesfully
      toast({
        position: 'top',
        title: `Customer updated!`,
        description: "We've updated customer for you 🎉.",
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    }

    // Set React state input fields empty
    setAddress('');
    setCity('');
    setZipcode('');
    setPhoneInputValue('');
    setEmail('');
    setSelectField('');
    setState('');
    setfirstName('');
    setlastName('');
    setlastName('');

    // Close drawer
    onClose();
  };

  return (
    <Drawer placement="right" onClose={onClose} isOpen={isOpen} size={'lg'}>
      <DrawerOverlay />
      <form method="PATCH" onSubmit={handleEditSubmit}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader shadow={'xs'}>Edit Customer</DrawerHeader>
          <DrawerBody>
            {/* <Text fontSize={'25px'} fontWeight={'bold'}>
              Edit
              <Text as="span" ml={'8px'} color={'blue.500'}>
                Customer
              </Text>
            </Text> */}
            <Text fontWeight={'bold'} color={'blue.500'} mt={'0rem'} mb={'1rem'}>
              Contact
            </Text>
            <FormControl>
              <Flex mb={'1rem'}>
                <Flex flexDir={'column'} mr={'1rem'}>
                  <FormLabel>First Name</FormLabel>
                  <Input
                    name="first_name"
                    type={'text'}
                    value={customer.first_name}
                    onChange={handleEditOnChange}
                  />
                </Flex>
                <Flex flexDir={'column'}>
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    name="last_name"
                    type={'text'}
                    value={customer?.last_name}
                    onChange={handleEditOnChange}
                  />
                </Flex>
              </Flex>
              <FormLabel mt={'1rem'}>Email</FormLabel>
              <Input
                name="email"
                type={'email'}
                value={customer?.email}
                onChange={handleEditOnChange}
              />
              <FormLabel mt={'1rem'}>Phone Number</FormLabel>
              <Input
                name="phone_number"
                type={'tel'}
                value={customer?.phone_number}
                onChange={handleEditOnChange}
              />
              <FormHelperText>Current Phone Number: {customer.phone_number}</FormHelperText>
              <Text fontWeight={'bold'} color={'blue.500'} mt={'2rem'} mb={'1rem'}>
                Location
              </Text>
              <FormLabel>Street Address</FormLabel>
              <Input
                name="street_address"
                type={'text'}
                defaultValue={customer?.street_address}
                onChange={handleEditOnChange}
              />
              <Flex mt={'1rem'}>
                <Flex flexDir={'column'} mr={'1rem'}>
                  <FormLabel>City</FormLabel>
                  <Input
                    name="city"
                    type={'text'}
                    defaultValue={customer?.city}
                    onChange={handleEditOnChange}
                  />
                </Flex>
                <Flex flexDir={'column'} mr={'1rem'}>
                  <FormLabel>State</FormLabel>
                  <Input
                    name="state"
                    type={'text'}
                    defaultValue={customer?.state}
                    onChange={handleEditOnChange}
                  />
                </Flex>
                <Flex flexDir={'column'}>
                  <FormLabel>Postal Code</FormLabel>
                  <Input
                    name="zipcode"
                    type={'text'}
                    defaultValue={customer?.zipcode}
                    onChange={handleEditOnChange}
                  />
                </Flex>
              </Flex>
              <Text fontWeight={'bold'} color={'blue.500'} mt={'2rem'} mb={'1rem'}>
                Customer Type
              </Text>
              <Select
                name="customer_type_id"
                onChange={handleEditOnChange}
                value={customer?.customer_type_id}>
                <MultiPurposeOptions data={customerTypes} />
              </Select>
            </FormControl>
          </DrawerBody>
          <DrawerFooter>
            <Button colorScheme="blue" mr={'1rem'} type="submit">
              Update Customer
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
};

export default EditCustomerForm;
