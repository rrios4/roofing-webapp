import React from 'react';
import { DrawerIndex } from '../';
import { Text, Flex, FormLabel, Select, Input, FormControl, Button, useColorModeValue, Textarea, Box } from '@chakra-ui/react';
import formatNumber from '../../utils/formatNumber';

const EditInvoiceForm = (props) => {
    const { onClose, isOpen, onOpen, initialRef, invoice, handleEditOnChange, handleEditSubmit } =  props
    const bg = useColorModeValue('white', 'gray.800');
    // console.log(invoice)

  return (
    <DrawerIndex initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose} bg={bg} size="lg">
            <Text fontSize={'25px'} fontWeight={'bold'}>Edit<Text as='span' ml={'8px'} color={'blue.500'}>INV</Text>-{invoice?.invoice_number}</Text>
            <Text fontWeight={'bold'} color={'blue.500'} mt={'2rem'} mb={'1rem'} fontSize={'lg'}>General Info</Text>
        <form method='PATCH' onSubmit={handleEditSubmit}>
            <Flex flexDir={'row'} mb={'1rem'}>
                <Flex flexDirection={'column'} mr={'1rem'}>
                    <FormLabel>Status</FormLabel>
                    <Select name='invoice_status_id' value={invoice?.invoice_status_id} onChange={handleEditOnChange}>
                        <option value={1}>Paid</option>
                        <option value={2}>Pending</option>
                        <option value={3}>Overdue</option>
                        <option value={4}>Draft</option>
                    </Select>
                </Flex>
                <Flex flexDirection={'column'}>
                    <FormLabel>Invoice Date</FormLabel>
                    <Input name='invoice_date' type='date' value={invoice?.invoice_date} onChange={handleEditOnChange}/>
                </Flex>
            </Flex>
            <Flex flexDirection={'column'} mb={'1rem'}>
                <FormLabel>Issue Date</FormLabel>
                <Input name='issue_date' type='date' value={invoice?.issue_date} onChange={handleEditOnChange}/>
            </Flex>
            <Flex flexDirection={'column'} mb={'1rem'}>
                <FormLabel>Due Date</FormLabel>
                <Input name='due_date' type='date' value={invoice?.due_date} onChange={handleEditOnChange}/>
            </Flex>
            <FormLabel>Service Type</FormLabel>
            <Select name='service_type_id' value={invoice?.service_type_id} onChange={handleEditOnChange}>
                <option value={1}>Roof Installation</option>
                <option value={2}>Roof Repair</option>
                <option value={3}>Roof Maintenance</option>
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
            <Text fontWeight={'bold'} color={'blue.500'} mt={'2rem'} fontSize={'lg'}>Extra Information</Text>
            <Flex gap={4} w='full' mt={'1rem'}>
                <Box w={'50%'}>
                    <FormLabel>Note</FormLabel>
                    <Textarea h={'200px'} name='note' value={invoice?.note} onChange={handleEditOnChange} placeholder='Here you enter notes regarding the invoice that you want to remember...'/>
                </Box>
                <Box w={'50%'}>
                    <FormLabel>Measurement</FormLabel>
                    <Textarea h={'200px'} name='sqft_measurement' value={invoice?.sqft_measurement} onChange={handleEditOnChange} placeholder='Here you enter measurements for roof...'/>
                </Box>
            </Flex>
            <FormLabel mt={'1rem'}>Customer Message</FormLabel>
            <Textarea name='cust_note' value={invoice?.cust_note} onChange={handleEditOnChange} placeholder='Here you enter customer message you want the customer to see...'/>

            {/* Controls for Drawer */}
            <Flex pt={'2rem'} justifyContent={'flex-end'}>
                <Button mx={'1rem'} onClick={onClose}>Cancel</Button>
                <Button colorScheme={'blue'} type='submit'>Save Changes</Button>
            </Flex>
        </form>
    </DrawerIndex>
  )
}

export default EditInvoiceForm