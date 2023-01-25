import React from 'react';
import { DrawerIndex } from '../';
import { Text, Flex, FormLabel, Select, Input, FormControl, Button, useColorModeValue, Textarea } from '@chakra-ui/react';
import formatNumber from '../../utils/formatNumber';

const EditInvoiceForm = (props) => {
    const { onClose, isOpen, onOpen, initialRef, invoice } =  props
    const bg = useColorModeValue('white', 'gray.800');
    console.log(invoice)


  return (
    <DrawerIndex initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose} bg={bg} size="lg">
        <Text fontSize={'25px'} fontWeight={'bold'}>Edit<Text as='span' ml={'8px'} color={'blue.500'}>INV</Text>-{invoice?.invoice_number}</Text>
        <Text fontWeight={'bold'} color={'blue.500'} mt={'2rem'} mb={'1rem'}>Invoice</Text>
        <Flex flexDir={'row'} mb={'1rem'}>
            <Flex flexDirection={'column'} mr={'1rem'}>
                <FormLabel>Status</FormLabel>
                <Select value={invoice?.invoice_status.name}>
                    <option>New</option>
                    <option>Scheduled</option>
                    <option>Expired</option>
                </Select>
            </Flex>
            <Flex flexDirection={'column'}>
                <FormLabel>Invoice Date</FormLabel>
                <Input type='date' value={invoice?.invoice_date}/>
            </Flex>
        </Flex>
        <Flex flexDirection={'column'} mb={'1rem'}>
            <FormLabel>Issue Date</FormLabel>
            <Input type='date' value={invoice?.issue_date}/>
        </Flex>
        <Flex flexDirection={'column'} mb={'1rem'}>
            <FormLabel>Due Date</FormLabel>
            <Input type='date' value={invoice?.due_date}/>
        </Flex>
        <FormLabel>Service Type</FormLabel>
        <Select value={invoice?.service_type.name}>
            <option>Roof Replacement</option>
            <option>Roof Leak Repair</option>
            <option>Roof Maintenance</option>
        </Select>
        <Text fontWeight={'bold'} color={'blue.500'} mt={'2rem'} mb={'1rem'}>Bill From</Text>
        <FormControl>
            <FormLabel htmlFor='city'>Street Address</FormLabel>
            <Input type={''} val/>
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
        </FormControl>
        <Text fontWeight={'bold'} color={'blue.500'} mt={'2rem'} mb={'1rem'}>Bill To</Text>
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
        </FormControl>
        <Text fontWeight={'bold'} color={'blue.500'} mt={'2rem'} mb={'1rem'}>Item List</Text>
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
        </Flex>
        <Text fontWeight={'bold'} color={'blue.500'} mb={'1rem'}>Notes</Text>
        <Textarea>{invoice?.note}</Textarea>
        <Flex pt={'2rem'} justifyContent={'flex-end'}>
            <Button mx={'1rem'} onClick={onClose}>Cancel</Button>
            <Button colorScheme={'blue'}>Save Changes</Button>
        </Flex>
    </DrawerIndex>
  )
}

export default EditInvoiceForm