import React from 'react';
import {
  Select,
  Flex,
  Text,
  Button,
  Input,
  FormControl,
  FormLabel,
  useColorModeValue,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter
} from '@chakra-ui/react';
import { MultiPurposeOptions } from '../..';

const EditEstimateRequestForm = (props) => {
  const {
    isOpen,
    onOpen,
    onClose,
    objectData,
    initialRef,
    handleSubmit,
    handleEditOnChange,
    handleEditCancel,
    services,
    qrStatuses
  } = props;

  // Chakra UI Modal
  // const { isOpen, onOpen, onClose } = useDisclosure();
  // const initialRef = React.useRef();

  return (
    <Drawer placement="right" onClose={onClose} isOpen={isOpen} size={'lg'}>
      <DrawerOverlay />
      <form onSubmit={handleSubmit} method="PATCH">
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader shadow={'xs'}>Edit Quote Request-{objectData.id}</DrawerHeader>
          <DrawerBody>
            {/* <Text fontSize={'25px'} fontWeight={'bold'}>
            Edit
            <Text as="span" ml={'8px'} color={'blue.500'}>
              QR
            </Text>
            -{objectData.id}
          </Text> */}
            <Text fontWeight={'bold'} color={'blue.500'} mt={'0rem'} mb={'1rem'}>
              Request
            </Text>
            <Flex flexDir={'row'} mb={'1rem'}>
              <Flex flexDirection={'column'} mr={'1rem'}>
                <FormLabel>Status</FormLabel>
                <Select
                  name="est_request_status_id"
                  value={objectData.est_request_status_id}
                  onChange={handleEditOnChange}>
                  <MultiPurposeOptions data={qrStatuses} />
                </Select>
              </Flex>
              <Flex flexDirection={'column'}>
                <FormLabel>Date</FormLabel>
                <Input
                  name="requested_date"
                  type="date"
                  value={objectData.requested_date}
                  onChange={handleEditOnChange}
                />
              </Flex>
            </Flex>
            <Flex flexDir={'row'}>
              <Flex flexDirection={'column'} mr={'1rem'}>
                <FormLabel>Customer Type</FormLabel>
                <Select
                  name="customer_typeID"
                  value={objectData.customer_typeID}
                  onChange={handleEditOnChange}>
                  <option value={1}>Residential</option>
                  <option value={2}>Commercial</option>
                  <option value={3}>Other</option>
                </Select>
              </Flex>
              <Flex flexDirection={'column'}>
                <FormLabel>Select Service</FormLabel>
                <Select
                  name="service_type_id"
                  value={objectData.service_type_id}
                  onChange={handleEditOnChange}>
                  <MultiPurposeOptions data={services} />
                </Select>
              </Flex>
            </Flex>
            <Text fontWeight={'bold'} color={'blue.500'} mt={'2rem'} mb={'1rem'}>
              Address
            </Text>
            <FormControl>
              <FormLabel htmlFor="city">Street Address</FormLabel>
              <Input
                name="streetAddress"
                type={'text'}
                value={objectData.streetAddress}
                onChange={handleEditOnChange}
              />
            </FormControl>
            <Flex mt={'1rem'} flexDir={'row'} mb={'1rem'}>
              <Flex flexDirection={'column'} mr={'1rem'}>
                <FormLabel>City</FormLabel>
                <Input
                  name="city"
                  type={'text'}
                  defaultValue={objectData.city}
                  onChange={handleEditOnChange}
                />
              </Flex>
              <Flex flexDirection={'column'}>
                <FormLabel>State</FormLabel>
                <Input
                  name="state"
                  type={'text'}
                  value={objectData.state}
                  onChange={handleEditOnChange}
                />
              </Flex>
              <Flex flexDirection={'column'} ml={'1rem'}>
                <FormLabel>Post Code</FormLabel>
                <Input
                  name="zipcode"
                  type={'text'}
                  value={objectData.zipcode}
                  onChange={handleEditOnChange}
                />
              </Flex>
            </Flex>
            <Text fontWeight={'bold'} color={'blue.500'} mt={'2rem'} mb={'1rem'}>
              Client
            </Text>
            <Flex flexDir={'row'} mb={'1rem'}>
              <Flex flexDirection={'column'} mr={'1rem'}>
                <FormLabel>First Name</FormLabel>
                <Input
                  name="firstName"
                  type={'text'}
                  value={objectData.firstName}
                  onChange={handleEditOnChange}
                />
              </Flex>
              <Flex flexDirection={'column'} ml={'1rem'}>
                <FormLabel>Last Name</FormLabel>
                <Input
                  name="lastName"
                  type={'text'}
                  value={objectData.lastName}
                  onChange={handleEditOnChange}
                />
              </Flex>
            </Flex>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                name="email"
                type={'email'}
                value={objectData.email}
                onChange={handleEditOnChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="phone" mt={'1rem'}>
                Phone Number
              </FormLabel>
              <Input
                name="phone_number"
                type={'tel'}
                value={objectData.phone_number}
                onChange={handleEditOnChange}
              />
            </FormControl>
          </DrawerBody>
          <DrawerFooter>
            <Button colorScheme={'blue'} type="submit">
              Update QR
            </Button>
            <Button mx={'1rem'} onClick={handleEditCancel}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
};

export default EditEstimateRequestForm;
