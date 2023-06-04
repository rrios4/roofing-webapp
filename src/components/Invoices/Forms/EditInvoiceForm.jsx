import React from 'react';
import { MultiPurposeOptions } from '../..';
import {
  Text,
  Flex,
  FormLabel,
  Select,
  Input,
  Button,
  useColorModeValue,
  Textarea,
  Box,
  DrawerFooter,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody
} from '@chakra-ui/react';
import { formatNumber } from '../../../utils';

const EditInvoiceForm = (props) => {
  const {
    onClose,
    isOpen,
    onOpen,
    initialRef,
    invoice,
    handleEditOnChange,
    handleEditSubmit,
    loadingState,
    services,
    invoiceStatuses
  } = props;

  // React styling hooks
  const bg = useColorModeValue('white', 'gray.800');

  return (
    <Drawer placement="right" onClose={onClose} isOpen={isOpen} size={{ base: 'full', md: 'lg' }}>
      <form method="PATCH" onSubmit={handleEditSubmit}>
        <DrawerOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Edit Invoice #{formatNumber(invoice?.invoice_number)}</DrawerHeader>
          <DrawerBody>
            {/* <Text fontSize={'25px'} fontWeight={'bold'}>
              Edit
              <Text as="span" ml={'8px'} color={'blue.500'}>
                INV
              </Text>
              -{invoice?.invoice_number}
            </Text> */}
            <Text fontWeight={'bold'} color={'blue.500'} mt={'0rem'} mb={'1rem'} fontSize={'lg'}>
              General Info
            </Text>
            <Flex mb={'1rem'} gap={8}>
              <Box w={'50%'}>
                <FormLabel>Status</FormLabel>
                <Select
                  name="invoice_status_id"
                  value={invoice?.invoice_status_id}
                  onChange={handleEditOnChange}>
                  <MultiPurposeOptions data={invoiceStatuses} />
                </Select>
              </Box>
              <Box w={'50%'}>
                <FormLabel>Invoice Date</FormLabel>
                <Input
                  name="invoice_date"
                  type="date"
                  value={invoice?.invoice_date}
                  onChange={handleEditOnChange}
                />
              </Box>
            </Flex>
            <Flex gap={8}>
              <Box w={'50%'} mb={'1rem'}>
                <FormLabel>Issue Date</FormLabel>
                <Input
                  name="issue_date"
                  type="date"
                  value={invoice?.issue_date}
                  onChange={handleEditOnChange}
                />
              </Box>
              <Box w={'50%'} mb={'1rem'}>
                <FormLabel>Due Date</FormLabel>
                <Input
                  name="due_date"
                  type="date"
                  value={invoice?.due_date}
                  onChange={handleEditOnChange}
                />
              </Box>
            </Flex>
            <FormLabel>Select Service</FormLabel>
            <Select
              name="service_type_id"
              value={invoice?.service_type_id}
              onChange={handleEditOnChange}>
              <MultiPurposeOptions data={services} />
            </Select>
            {/* <Text fontWeight={'bold'} color={'blue.500'} mt={'2rem'} mb={'1rem'}>Bill From</Text>
            <FormControl>
                <FormLabel htmlFor='city'>Street Address</FormLabel>
                <Input type={''}/>
            </FormControl>
            <Flex mt={'1rem'} flexDir={'row'} mb={'1rem'}>
                <Flex flexDirection={'column'} mr={'1rem'}>
                    <FormLabel>City</FormLabel>
                    <Input/>
                </Flex>
                <Flex flexDirection={'column'} ml={'1rem'}>
                    <FormLabel>Post Code</FormLabel>
                    <Input/>
                </Flex>
            </Flex>
            <FormControl>
                <FormLabel htmlFor='city'>State</FormLabel>
                <Input type={''}/>
            </FormControl> */}
            {/* <Text fontWeight={'bold'} color={'blue.500'} mt={'2rem'} mb={'1rem'}>Bill To</Text>
            <Flex flexDir={'row'} mb={'1rem'}>
                <Flex flexDirection={'column'} mr={'1rem'}>
                    <FormLabel>First Name</FormLabel>
                    <Input value={invoice?.customer.first_name}/>
                </Flex>
                <Flex flexDirection={'column'} ml={'1rem'}>
                    <FormLabel>Last Name</FormLabel>
                    <Input value={invoice?.customer.last_name}/>
                </Flex>
            </Flex>
            <FormControl>
                <FormLabel htmlFor='city'>Email</FormLabel>
                <Input type={''} value={invoice?.customer.email}/>
            </FormControl> */}
            {/* <Text fontWeight={'bold'} color={'blue.500'} mt={'2rem'} mb={'1rem'}>Item List</Text>
            <Text fontWeight={'bold'} color={'blue.500'} mt={'2rem'} mb={'1rem'}>Total</Text>
            <Flex flexDir={'row'} mb={'1rem'}>
                <Flex flexDirection={'column'} mr={'1rem'}>
                    <FormLabel>Subtotal</FormLabel>
                    <Input/>
                </Flex>
                <Flex flexDirection={'column'} ml={'1rem'}>
                    <FormLabel>Total</FormLabel>
                    <Input/>
                </Flex>
            </Flex> */}
            <Text fontWeight={'bold'} color={'blue.500'} mt={'2rem'} fontSize={'lg'}>
              Additional Information
            </Text>
            <Flex gap={4} w="full" mt={'1rem'}>
              <Box w={'50%'}>
                <FormLabel>Internal Note</FormLabel>
                <Textarea
                  h={'200px'}
                  name="private_note"
                  value={invoice?.private_note}
                  onChange={handleEditOnChange}
                  placeholder="Here you enter notes regarding the invoice that you want to remember..."
                />
              </Box>
              <Box w={'50%'}>
                <FormLabel>Measurement</FormLabel>
                <Textarea
                  h={'200px'}
                  name="sqft_measurement"
                  value={invoice?.sqft_measurement}
                  onChange={handleEditOnChange}
                  placeholder="Here you enter measurements for roof..."
                />
              </Box>
            </Flex>
            <FormLabel mt={'1rem'}>Customer Note</FormLabel>
            <Textarea
              name="public_note"
              value={invoice?.public_note}
              onChange={handleEditOnChange}
              placeholder="Here you enter customer message you want the customer to see..."
            />
          </DrawerBody>
          <DrawerFooter gap={4}>
            <Button colorScheme={'blue'} type="submit" isLoading={loadingState}>
              Update Invoice
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
};

export default EditInvoiceForm;
