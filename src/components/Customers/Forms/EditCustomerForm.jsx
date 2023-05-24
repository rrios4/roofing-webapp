import React from 'react';
import { MultiPurposeOptions } from '../..';
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

const EditCustomerForm = (props) => {
  const { isOpen, onClose, customer, handleEditOnChange, handleEditSubmit, customerTypes } = props;

  return (
    <Drawer placement="right" onClose={onClose} isOpen={isOpen} size={{ base: 'full', md: 'lg' }}>
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
